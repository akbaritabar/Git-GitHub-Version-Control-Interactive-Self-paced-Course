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

  // === Lazy fork archive creation ===
  // The archive issue is created here (not at fork time) because GitHub disables
  // Issues in all new forks by default. By the time step 1 is completed, the
  // student has had the opportunity to enable Issues following the instructions
  // posted in the first comment of this tracking issue.
  let archiveIssueUrl = null;
  const archiveMetaMatch = issueBody.match(/Fork archive:\s*(\S+)/);
  const archiveMetaValue = archiveMetaMatch ? archiveMetaMatch[1] : 'pending';

  if (archiveMetaValue === 'pending' || archiveMetaValue === 'disabled') {
    // Issue not yet created — attempt to create it now
    const [archiveForkOwner, archiveForkName] = forkRepo.split('/');
    try {
      const archiveBody = [
        '# Course Materials Archive — Git/GitHub Interactive Course',
        '',
        'This issue is a personal archive of your course materials.',
        '',
        `**Source:** Your course tracking issue: ${issue.html_url}`,
        '',
        'Teaching content from each step will be added here as you complete it.',
        'You can return to this issue at any time to review what you learned.',
        '',
        '---',
        '',
        '*Your active course interaction takes place in the upstream repository. This archive is for your personal reference.*'
      ].join('\n');
      const createdArchive = await github.rest.issues.create({
        owner: archiveForkOwner,
        repo: archiveForkName,
        title: 'Course Materials Archive — Git/GitHub Interactive Course',
        body: archiveBody
      });
      archiveIssueUrl = createdArchive.data.html_url;
    } catch (createErr) {
      core.warning(`Could not create fork archive issue in step 1: ${createErr.message}`);
    }
  } else {
    // URL already stored from a previous attempt
    archiveIssueUrl = archiveMetaValue;
  }

  // Build the final tracking body: checklist update + archive URL (if newly created)
  let finalBody = updatedBody;
  if (archiveIssueUrl && archiveMetaValue !== archiveIssueUrl) {
    finalBody = finalBody.replace(
      /Fork archive:\s*\S+/,
      `Fork archive: ${archiveIssueUrl}`
    );
  }

  await github.rest.issues.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: finalBody,
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
    'Your answer covers the Git and version control basics well. Step 2 is now unlocked and covers GitHub — the online hosting and collaboration platform that works with Git.',
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
    if (archiveIssueUrl) {
      const urlMatch = archiveIssueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
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
            '## Step 1 — Git and Version Control Basics',
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
      body: '> **NOTE:** Could not save step 1 materials to your fork archive. If you have enabled Issues in your fork, please let your instructor know. Your course progress is not affected.'
    });
  }

  core.setOutput('validated', 'true');
};
