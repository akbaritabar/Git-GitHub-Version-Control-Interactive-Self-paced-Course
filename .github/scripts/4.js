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
    stepNumber: 4
  });

  if (!answerCheck.found) {
    await helpers.createComment({
      github,
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: `Step 4 is not complete yet.\n\n${answerCheck.question.failureMessage}`
    });
    core.setOutput('validated', 'false');
    return;
  }

  // === Lazy fork archive creation (final fallback) ===
  let archiveIssueUrl = null;
  const archiveMetaMatch = issueBody.match(/Fork archive:\s*(\S+)/);
  const archiveMetaValue = archiveMetaMatch ? archiveMetaMatch[1] : 'pending';

  if (archiveMetaValue === 'pending' || archiveMetaValue === 'disabled') {
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
      core.warning(`Could not create fork archive issue in step 4: ${createErr.message}`);
    }
  } else {
    archiveIssueUrl = archiveMetaValue;
  }

  // Re-read the latest issue body after any archive URL update
  const latestIssueBody = (await github.rest.issues.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number
  })).data.body || '';

  const updatedBody = helpers.markChecklistItem(latestIssueBody, 4);
  await github.rest.issues.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: updatedBody,
    state: 'open'
  });

  // === Post course completion message ===
  await helpers.createComment({
    github,
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: [
      'Step 4 complete. Congratulations on finishing all four steps of the Git and GitHub interactive course! 🎉',
      '',
      'You have worked through the full course and demonstrated understanding of:',
      '',
      '- Git as a version control system for tracking project history',
      '- GitHub as a hosting and collaboration platform',
      '- Forks, branches, pull requests, and collaborative workflows',
      '- Advanced tools and reproducibility practices for research and software development',
      '',
      'Please leave a final comment in this issue with any thoughts, feedback, or questions. What was most useful? What could be improved?',
      '',
      'Well done, and good luck applying these skills in your work!'
    ].join('\n')
  });

  // === Attempt to archive step 4 teaching content in fork ===
  const variables = helpers.buildTemplateVariables({
    context,
    forkRepo,
    trackingIssueUrl: issue.html_url,
    participant: context.actor,
    defaultBranch
  });

  try {
    if (archiveIssueUrl) {
      const urlMatch = archiveIssueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
      if (urlMatch) {
        const [, archiveOwner, archiveRepo, archiveIssueStr] = urlMatch;
        const stepContent = helpers.loadStepMarkdown(4, variables);
        const teachingContent = helpers.extractTeachingContent(stepContent);
        const completionDate = new Date().toISOString().slice(0, 10);
        await helpers.createComment({
          github,
          owner: archiveOwner,
          repo: archiveRepo,
          issue_number: parseInt(archiveIssueStr, 10),
          body: [
            '## Step 4 — Advanced Git, GitHub Tools, and Reproducibility',
            '',
            `*Archived from your course tracking issue: ${issue.html_url}*`,
            `*Step 4 completed: ${completionDate}*`,
            '',
            '---',
            '',
            teachingContent,
            '',
            '---',
            '',
            '**Course complete!** All step materials are now archived in this issue for your personal reference.'
          ].join('\n')
        });
      }
    }
  } catch (archiveErr) {
    core.warning(`Could not write step 4 to fork archive: ${archiveErr.message}`);
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
        body: `@${context.actor} has successfully completed all four steps of the Git/GitHub interactive course. This enrollment record is now closed.`
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
