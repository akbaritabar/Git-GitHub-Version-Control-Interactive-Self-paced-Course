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

  const max = Math.max(...allNumbers);
  const commentBody = context.payload.comment.body || '';

  // Step 1: Check whether this comment contains a /done N command.
  // We look for /done N as a standalone line anywhere in the comment, which
  // allows students to include both their written answer and the command in
  // one comment without the command being silently ignored.
  // Bot-posted messages never contain /done N on its own line, so extracting
  // it line-by-line is safe and does not create feedback loops.
  const commandLine = commentBody
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /^\/done\s+\d+$/i.test(l)) || '';
  const commandMatch = /^\/done\s+(\d+)$/i.exec(commandLine);

  if (!commandMatch) {
    // The comment does not contain a /done N command on its own line.
    // Only send a format hint to the registered participant, and only for
    // single-line comments that look like a misformatted attempt.
    // Never reply to ordinary answer comments or to bot-posted messages.
    const earlyParticipantMatch = body.match(/^Participant:\s*`([^`]+)`\s*$/m);
    const earlyParticipant = earlyParticipantMatch ? earlyParticipantMatch[1] : null;
    const actorIsParticipant =
      earlyParticipant &&
      context.actor.toLowerCase() === earlyParticipant.toLowerCase();

    const isSingleLine = !commentBody.trim().includes('\n');
    if (actorIsParticipant && /done/i.test(commentBody) && isSingleLine) {
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

  // Step 2: Verify the commenter is the registered participant.
  const participantMatch = body.match(/^Participant:\s*`([^`]+)`\s*$/m);
  if (!participantMatch) {
    // The issue body is malformed and the participant cannot be confirmed.
    // Block silently; the maintainer should inspect the tracking issue body.
    return '-1';
  }
  const participant = participantMatch[1];
  if (context.actor.toLowerCase() !== participant.toLowerCase()) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: `Only @${participant} can use \`/done N\` in this tracking issue.`
    });
    return '-1';
  }

  // Step 3: Validate the step number.
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
