const helpers = require('./github-helpers.js');

module.exports = async function ({ github, context, core }) {
  const issue = context.payload.issue;
  const issueBody = issue.body || '';

  const answerCheck = await helpers.findLatestValidAnswer({
    github,
    context,
    issueNumber: context.issue.number,
    actor: context.actor,
    stepNumber: 2
  });

  if (!answerCheck.found) {
    await helpers.createComment({
      github,
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: `Step 2 is not complete yet.\n\n${answerCheck.question.failureMessage}`
    });
    core.setOutput('validated', 'false');
    return;
  }

  const updatedBody = helpers.markChecklistItem(issueBody, 2);
  await github.rest.issues.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: updatedBody,
    state: 'open'
  });

  await helpers.createComment({
    github,
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: [
      'Step 2 complete. Congratulations on finishing the Git and GitHub interactive course.',
      '',
      'You have worked through both steps and demonstrated a solid understanding of:',
      '',
      '- using Git to track and audit project history',
      '- using GitHub for collaboration and remote hosting',
      '- forks, remotes, pull, push, and branch workflows',
      '- connecting version control practices to reproducible and open science workflows',
      '',
      'Please leave a final comment in this issue with any thoughts, feedback, or questions about the course.',
      'When you are ready, click **Close issue** (or use "Close with comment" after your last reply) to mark your participation as complete.',
      '',
      'Well done.'
    ].join('\n')
  });

  core.setOutput('validated', 'true');
};
