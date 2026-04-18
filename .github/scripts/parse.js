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
  const trimmed = (context.payload.comment.body || '').trim();

  // Step 1: Check whether this comment is a /done N command.
  // This check must come first to avoid posting bot messages in response to
  // ordinary comments (including bot-posted messages), which would create a
  // feedback loop where bot messages containing "done" re-trigger the workflow.
  const commandMatch = /^\/done\s+(\d+)$/i.exec(trimmed);

  if (!commandMatch) {
    // The comment is not a /done N command.
    // Only send a format hint to the registered participant. Never reply to
    // comments from other users or to multi-line messages (which are likely
    // answer drafts or bot-posted content, not intended commands).
    const earlyParticipantMatch = body.match(/^Participant:\s*`([^`]+)`\s*$/m);
    const earlyParticipant = earlyParticipantMatch ? earlyParticipantMatch[1] : null;
    const actorIsParticipant =
      earlyParticipant &&
      context.actor.toLowerCase() === earlyParticipant.toLowerCase();

    if (actorIsParticipant && /done/i.test(trimmed) && !trimmed.includes('\n')) {
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
