const helpers = require('./github-helpers.js');

module.exports = async function ({ github, context, core }) {
  const issue = context.payload.issue;
  const issueBody = issue.body || '';
  const forkMatch = issueBody.match(/Fork repo:\s*`([^`]+)`/);
  const forkRepo = forkMatch ? forkMatch[1] : '';
  const defaultBranch = context.payload.repository.default_branch;

  const answerCheck = await helpers.findLatestValidAnswer({
    github,
    context,
    issueNumber: context.issue.number,
    actor: context.actor,
    stepNumber: 1
  });

  if (!answerCheck.found) {
    await helpers.createComment({
      github,
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: `🚫 Step 1 is not complete yet.\n\n${answerCheck.question.failureMessage}`
    });
    core.setOutput('validated', 'false');
    return;
  }

  const updatedBody = helpers.markChecklistItem(issueBody, 1);
  await github.rest.issues.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: updatedBody,
    state: 'open'
  });

  const variables = helpers.buildTemplateVariables({
    context,
    forkRepo,
    trackingIssueUrl: issue.html_url,
    participant: context.actor,
    defaultBranch
  });

  const nextStep = helpers.loadStepMarkdown(2, variables);
  const body = [
    '🎉 Step 1 complete.',
    '',
    'Your answer covered the foundations well. Step 2 is now unlocked.',
    '',
    nextStep
  ].join('\n');

  await helpers.createComment({
    github,
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body
  });

  core.setOutput('validated', 'true');
};
