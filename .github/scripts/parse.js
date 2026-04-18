module.exports = async function ({ github, context }) {
  const body = context.payload.issue.body || '';
  const allTaskRe = /^\s*-\s*\[[ x]\]\s*(\d+)\./gm;
  const openTaskRe = /^\s*-\s*\[\s\]\s*(\d+)\./gm;
  const allNumbers = [];
  const openNumbers = [];
  let match;

  while ((match = allTaskRe.exec(body)) !== null) {
    allNumbers.push(Number.parseInt(match[1], 10));
  }

  while ((match = openTaskRe.exec(body)) !== null) {
    openNumbers.push(Number.parseInt(match[1], 10));
  }

  if (allNumbers.length === 0) {
    return '-1';
  }

  const participantMatch = body.match(/^Participant:\s*`([^`]+)`\s*$/m);
  const participant = participantMatch ? participantMatch[1] : null;
  if (participant && context.actor.toLowerCase() !== participant.toLowerCase()) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: `Only @${participant} can use \`/done N\` in this tracking issue.`
    });
    return '-1';
  }

  const max = Math.max(...allNumbers);
  const trimmed = (context.payload.comment.body || '').trim();
  const commandMatch = /^\/done\s+(\d+)$/i.exec(trimmed);

  if (!commandMatch) {
    if (/done/i.test(trimmed) && !trimmed.includes('\n')) {
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: [
          'Your comment mentions "done" but does not use the required format.',
          '',
          `Use \`/done N\` where N is a step number between 1 and ${max}.`
        ].join('\n')
      });
    }
    return '-1';
  }

  const stepNumber = Number.parseInt(commandMatch[1], 10);
  if (stepNumber < 1 || !allNumbers.includes(stepNumber)) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: `Invalid step number. Please use a number between 1 and ${max}.`
    });
    return '-1';
  }

  if (!openNumbers.includes(stepNumber)) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: `Step ${stepNumber} is already marked complete in this tracking issue.`
    });
    return '-1';
  }

  return String(stepNumber);
};
