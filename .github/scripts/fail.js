module.exports = async function ({ github, context, env }) {
  const step = env.MILESTONE || '?';
  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: [
      `Workflow error while processing /done ${step}.`,
      '',
      'This looks like an automation problem rather than a participant mistake.',
      'Please ask the course maintainer to inspect the workflow run logs for this repository.'
    ].join('\n')
  });
};
