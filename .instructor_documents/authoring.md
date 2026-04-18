# Instructor Authoring Guide

This guide is for instructors and maintainers of the current two-step course.

## Important note about answer checking

For public repositories, no client-side pattern can fully prevent motivated participants from reverse-engineering checks, because workflow code is visible.

This implementation reduces easy bypassing by using:

- required concept patterns
- minimum word count
- sentence-structure checks
- participant-only step progression for `/done N`

In practice, this means a simple list of isolated keywords should fail more often than before, and participants are expected to write short explanatory answers.

## Current instructor-editable files

- `content/steps/step-1.md`
- `content/steps/step-2.md`
- `.course_config/questions/step-1.json`
- `.course_config/questions/step-2.json`
- `images/`
- `.github/scripts/1.js`
- `.github/scripts/2.js`

## Current workflow files

- `.github/workflows/start.yml`
- `.github/workflows/continue.yml`
- `.github/scripts/parse.js`
- `.github/scripts/github-helpers.js`

## How to extend the course to step 3 and beyond

Use this checklist each time you add a new step:

1. Create a new lesson file:
  - `content/steps/step-3.md`
2. Create a new question configuration:
  - `.course_config/questions/step-3.json`
3. Create a new validator script:
  - copy `.github/scripts/2.js` to `.github/scripts/3.js`
  - update the script so it validates `stepNumber: 3`
4. Update the previous step script to unlock the new step:
  - edit `.github/scripts/2.js`
  - replace the final completion message with a message that posts step 3 content
5. Update the initial tracking checklist:
  - edit `.github/workflows/start.yml`
  - add `- [ ] 3. <step title>` to the issue body template
6. Ensure the parser can see the new unchecked step number:
  - no parser code changes are needed if the checklist line is present in the issue body
7. Test the full flow in a test fork:
  - verify only the correct participant can progress
  - verify `/done 3` cannot be repeated once checked

If you add many steps, keep one script per step (`N.js`) so each checkpoint stays readable and easy to maintain.

## How question validation works

Each question file includes:

- `requiredPatterns`: all patterns must match the same participant answer comment.
- `minimumWordCount`: minimum number of words expected in the answer.
- `requireSentenceStructure`: if true, the answer must look like normal explanatory writing.
- `failureMessage`: response shown when validation fails.

The checker scans participant comments in reverse order and uses the latest answer that satisfies all checks.

## Question file format

```json
{
  "step": 1,
  "prompt": "Question text",
  "requiredPatterns": ["regex1", "regex2"],
  "minimumWordCount": 20,
  "requireSentenceStructure": true,
  "failureMessage": "What to tell participants when answer validation fails."
}
```

## Markdown placeholders in step files

- `{{TRACKING_ISSUE_URL}}`
- `{{FORK_REPO}}`
- `{{IMAGE_BASE_URL}}`
- `{{UPSTREAM_REPO}}`
- `{{PARTICIPANT}}`

## Participant progression guardrails

- Only the participant who forked the repository can progress with `/done N`.
- Already completed steps cannot be re-run to trigger duplicate unlock messages.

## Required secret

For the current two-step version, only one secret is required in your upstream course repository:

- `GH_PAT_CROSSREPO`

Path in GitHub UI:

- `Settings`
- `Secrets and variables`
- `Actions`
- `New repository secret`

For a public repository, a classic token with `public_repo` is usually enough.
For private testing, use `repo` access.

## GitHub settings instructors should verify

In addition to adding the required secret, check these repository settings:

1. Actions enabled in upstream repository
  - Repository Settings -> Actions -> General
  - Ensure workflows are allowed to run.
2. Issues enabled in upstream repository
  - Repository Settings -> Features
  - Ensure Issues is checked.
3. Forking policy for private testing
  - If testing in a private repository, ensure private forking is allowed by your account or organization policy.
4. Collaborator access for private testing
  - Test participants must have access to the upstream private repository before they can fork and participate.

## Optional future secret

This scaffold currently does not require an additional upstream write token beyond `GH_PAT_CROSSREPO`.

If future steps need cross-repository content edits, branch creation, or pull-request automation in other repositories, you can add a second secret such as `GH_PAT_UPSTREAM` and wire it into those future step scripts.

## Private repository reminder

Private testing can work if private forking is enabled and testers can access the upstream private repository.

Image embedding is less predictable in private setups. Keep core instructions text-first and verify image rendering during testing.
