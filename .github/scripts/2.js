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
      '- Using Git to track and audit project history',
      '- Using GitHub for collaboration and remote hosting',
      '- Forks, remotes, pull, push, and branch workflows',
      '- Connecting version control practices to reproducible and open science workflows',
      '',
      'Please leave a final comment in this issue with any thoughts, feedback, or questions about the course. What could be improved? What did you like?',
      '',
      'When you are ready, click **Close issue** (or use "Close with comment" after your last reply) to mark your participation as complete.',
      '',
      'Well done!'
    ].join('\n')
  });

  // === Attempt to archive step 2 teaching content in fork ===
  const variables = helpers.buildTemplateVariables({
    context,
    forkRepo,
    trackingIssueUrl: issue.html_url,
    participant: context.actor,
    defaultBranch
  });

  try {
    const archiveMetaMatch = issueBody.match(/Fork archive:\s*(\S+)/);
    const archiveMetaValue = archiveMetaMatch ? archiveMetaMatch[1] : 'pending';
    let archiveIssueUrl = null;

    if (archiveMetaValue === 'pending' || archiveMetaValue === 'disabled') {
      // Still not created — attempt now (student may have enabled Issues after step 1)
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
        // Update tracking issue body with the new archive URL
        const latestBody = (await github.rest.issues.get({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number
        })).data.body || '';
        await github.rest.issues.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number,
          body: latestBody.replace(/Fork archive:\s*\S+/, `Fork archive: ${archiveIssueUrl}`)
        });
      } catch (createErr) {
        core.warning(`Could not create fork archive issue in step 2: ${createErr.message}`);
      }
    } else {
      archiveIssueUrl = archiveMetaValue;
    }

    if (archiveIssueUrl) {
      const urlMatch = archiveIssueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
      if (urlMatch) {
        const [, archiveOwner, archiveRepo, archiveIssueStr] = urlMatch;
        const stepContent = helpers.loadStepMarkdown(2, variables);
        const teachingContent = helpers.extractTeachingContent(stepContent);
        const completionDate = new Date().toISOString().slice(0, 10);
        await helpers.createComment({
          github,
          owner: archiveOwner,
          repo: archiveRepo,
          issue_number: parseInt(archiveIssueStr, 10),
          body: [
            '## Step 2 — Forks, Remotes, Branches, and Collaboration',
            '',
            `*Archived from your course tracking issue: ${issue.html_url}*`,
            `*Step 2 completed: ${completionDate}*`,
            '',
            '---',
            '',
            teachingContent,
            '',
            '---',
            '',
            '**Course complete.** All step materials are now archived in this issue for your personal reference.'
          ].join('\n')
        });
      }
    }
  } catch (archiveErr) {
    core.warning(`Could not write step 2 to fork archive: ${archiveErr.message}`);
  }

  // === Close enrollment issue ===
  try {
    const enrollmentMatch = issueBody.match(/Enrollment issue:\s*#(\d+)/);
    if (enrollmentMatch) {
      const enrollmentNumber = parseInt(enrollmentMatch[1], 10);
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: enrollmentNumber,
        body: `@${context.actor} has successfully completed the Git/GitHub interactive course. This enrollment record is now closed.`
      });
      await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: enrollmentNumber,
        state: 'closed',
        state_reason: 'completed'
      });
    }
  } catch (enrollErr) {
    core.warning(`Could not close enrollment issue: ${enrollErr.message}`);
  }

  core.setOutput('validated', 'true');
};
