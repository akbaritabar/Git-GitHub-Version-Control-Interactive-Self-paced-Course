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
  const raw = readWorkspaceFile(`content/questions/step-${stepNumber}.json`);
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

  for (let index = relevant.length - 1; index >= 0; index -= 1) {
    const body = relevant[index].body || '';
    const matchesAll = question.requiredPatterns.every((pattern) => {
      return new RegExp(pattern, 'i').test(body);
    });
    if (matchesAll) {
      return { found: true, comment: relevant[index], question };
    }
  }

  return { found: false, question };
}

function markChecklistItem(issueBody, stepNumber) {
  const pattern = new RegExp(`^(\\s*-\\s*\\[)\\s(\\]\\s*${stepNumber}\\..*)$`, 'm');
  return issueBody.replace(pattern, '$1x$2');
}

module.exports = {
  buildTemplateVariables,
  createComment,
  createIssue,
  findLatestValidAnswer,
  loadStepMarkdown,
  loadQuestionConfig,
  markChecklistItem,
  readWorkspaceFile,
  renderTemplate
};
