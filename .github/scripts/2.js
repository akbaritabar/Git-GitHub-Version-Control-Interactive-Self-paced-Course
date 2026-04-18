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
      'Step 2 complete.',
      '',
      'You have completed the current two-step version of this interactive course.',
      '',
      'You now have the basic logic needed for:',
      '- using Git to track project history',
      '- using GitHub to collaborate',
      '- understanding forks, remotes, pulls, pushes, and branches',
      '- connecting Git workflows to reproducibility and open science practices',
      '',
      'If additional steps are added later, they can continue from this tracking issue.'
    ].join('\n')
  });

  core.setOutput('validated', 'true');
};
