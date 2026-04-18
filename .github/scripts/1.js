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
      body: `Step 1 is not complete yet.\n\n${answerCheck.question.failureMessage}`
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
    'Step 1 complete.',
    '',
    'Your answer demonstrates the foundational concepts clearly. Step 2 is now unlocked.',
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

  // === Attempt to archive step 1 teaching content in fork ===
  try {
    const archiveMatch = issueBody.match(/Fork archive:\s*(\S+)/);
    const archiveUrl = archiveMatch ? archiveMatch[1] : null;
    if (archiveUrl && archiveUrl !== 'disabled' && archiveUrl !== 'pending') {
      const urlMatch = archiveUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
      if (urlMatch) {
        const [, archiveOwner, archiveRepo, archiveIssueStr] = urlMatch;
        const stepContent = helpers.loadStepMarkdown(1, variables);
        const teachingContent = helpers.extractTeachingContent(stepContent);
        const completionDate = new Date().toISOString().slice(0, 10);
        await helpers.createComment({
          github,
          owner: archiveOwner,
          repo: archiveRepo,
          issue_number: parseInt(archiveIssueStr, 10),
          body: [
            '## Step 1 — Git, GitHub, and Version Control Basics',
            '',
            `*Archived from your course tracking issue: ${issue.html_url}*`,
            `*Step 1 completed: ${completionDate}*`,
            '',
            '---',
            '',
            teachingContent
          ].join('\n')
        });
      }
    }
  } catch (archiveErr) {
    core.warning(`Could not write step 1 to fork archive: ${archiveErr.message}`);
    await helpers.createComment({
      github,
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: '> **Note:** Could not save step 1 materials to your fork archive. If you have enabled Issues in your fork, please let your instructor know. Your course progress is not affected.'
    });
  }

  core.setOutput('validated', 'true');
};
