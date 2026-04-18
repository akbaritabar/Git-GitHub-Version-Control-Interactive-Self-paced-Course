const fs = require('fs');
const path = require('path');

async function createIssue({ github, owner, repo, title, body, labels }) {
  return github.rest.issues.create({ owner, repo, title, body, labels });
}

async function createComment({ github, owner, repo, issue_number, body }) {
  return github.rest.issues.createComment({ owner, repo, issue_number, body });
}

function renderTemplate(template, variables) {
  return template.replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (_, key) => {
    return Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : '';
  });
}

function readWorkspaceFile(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

function loadStepMarkdown(stepNumber, variables) {
  const template = readWorkspaceFile(`content/steps/step-${stepNumber}.md`);
  return renderTemplate(template, variables);
}

function loadQuestionConfig(stepNumber) {
  const raw = readWorkspaceFile(`.course_config/questions/step-${stepNumber}.json`);
  return JSON.parse(raw);
}

function buildTemplateVariables({ context, forkRepo, trackingIssueUrl, participant, defaultBranch }) {
  return {
    TRACKING_ISSUE_URL: trackingIssueUrl,
    FORK_REPO: forkRepo,
    UPSTREAM_REPO: `${context.repo.owner}/${context.repo.repo}`,
    PARTICIPANT: participant,
    IMAGE_BASE_URL: `https://raw.githubusercontent.com/${context.repo.owner}/${context.repo.repo}/${defaultBranch}/images`
  };
}

async function findLatestValidAnswer({ github, context, issueNumber, actor, stepNumber }) {
  const question = loadQuestionConfig(stepNumber);
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
    per_page: 100
  });

  const relevant = comments
    .filter((comment) => comment.user && comment.user.login === actor)
    .filter((comment) => !/^\/done\s+\d+$/i.test(comment.body.trim()));

  const minRequired = Number.isInteger(question.minimumRequiredPatterns)
    ? question.minimumRequiredPatterns
    : question.requiredPatterns.length;

  for (let index = relevant.length - 1; index >= 0; index -= 1) {
    const body = relevant[index].body || '';
    const matchCount = question.requiredPatterns.filter((pattern) => {
      return new RegExp(pattern, 'i').test(body);
    }).length;

    if (matchCount < minRequired) {
      continue;
    }

    const quality = evaluateAnswerQuality(body, question);
    if (quality.isValid) {
      return { found: true, comment: relevant[index], question };
    }
  }

  return { found: false, question };
}

function evaluateAnswerQuality(body, question) {
  const wordCount = (body.match(/\b[\p{L}\p{N}_'-]+\b/gu) || []).length;
  const minimumWordCount = Number.isInteger(question.minimumWordCount) ? question.minimumWordCount : 0;

  if (wordCount < minimumWordCount) {
    return { isValid: false, reason: 'too_short' };
  }

  if (question.requireSentenceStructure) {
    const hasSentenceBoundary = /[.!?]/.test(body) || body.split('\n').filter((line) => line.trim().length > 0).length >= 2;
    const hasActionVerb = /\b(is|are|was|were|be|use|uses|using|used|track|tracks|tracking|save|saves|saving|record|records|store|stores|share|shares|create|creates|work|works|help|helps|manage|run|support|supports|ensure|ensures|sync|syncs|explain|means|mean|keep|keeps|host|hosts|allow|allows|enable|enables|tell|tells|prevent|prevents|give|gives|contain|contains|list|lists|mark|marks|specify|specifies|describe|describes|let|lets|upload|push|pull|show|shows|connect|connects|provide|provides|make|makes|point|points)\b/i.test(body);

    if (!hasSentenceBoundary || !hasActionVerb) {
      return { isValid: false, reason: 'structure' };
    }
  }

  return { isValid: true };
}

function extractTeachingContent(markdown) {
  const markerIndex = markdown.search(/^### Your question for step/im);
  if (markerIndex === -1) return markdown.trim();
  return markdown.slice(0, markerIndex).trim();
}

function markChecklistItem(issueBody, stepNumber) {
  const pattern = new RegExp(`^(\\s*-\\s*\\[)\\s(\\]\\s*${stepNumber}\\..*)$`, 'm');
  return issueBody.replace(pattern, '$1x$2');
}

module.exports = {
  buildTemplateVariables,
  createComment,
  createIssue,
  extractTeachingContent,
  findLatestValidAnswer,
  loadStepMarkdown,
  loadQuestionConfig,
  markChecklistItem,
  readWorkspaceFile,
  renderTemplate,
  evaluateAnswerQuality
};
