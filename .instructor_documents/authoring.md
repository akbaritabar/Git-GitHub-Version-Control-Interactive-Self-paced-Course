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

For the current two-step version, only one secret is required in your upstream course repository.

### Step 1 — Create a Personal Access Token (classic)

1. Go to your GitHub account: Settings (top-right avatar) -> Developer settings -> Personal access tokens -> Tokens (classic) -> Generate new token (classic).
2. Give it a descriptive note, for example: `course-crossrepo`.
3. Set the expiration to a date that covers your course period (or "No expiration" for a permanent token).
4. Under "Select scopes", check **`repo`** (the full `repo` scope, not just `public_repo`).
   - `repo` is required for both public and private upstream repositories.
   - If you only check `public_repo`, the token cannot create issues or comments in private repositories and the workflow will fail with `Bad credentials`.
5. Click "Generate token" and copy the token value immediately. GitHub will not show it again.

### Step 2 — Add the token as a repository secret

1. Go to your upstream course repository on GitHub.
2. Settings -> Secrets and variables -> Actions -> New repository secret.
3. Set the name to exactly: `GH_PAT_CROSSREPO`
   - The name must match exactly, including capitalisation. The workflows reference `${{ secrets.GH_PAT_CROSSREPO }}` by this exact name.
4. Paste the token value you copied in Step 1.
5. Click "Add secret".

## GitHub settings instructors should verify

In addition to adding the required secret, check these repository settings:

1. Actions enabled in upstream repository
  - Repository Settings -> Actions -> General
  - Ensure workflows are allowed to run.
2. Issues enabled in upstream repository
  - Repository Settings -> Features
  - Ensure Issues is checked.
3. Create the `new_participant` label in the upstream repository
  - Go to Issues -> Labels -> New label.
  - Set the name to exactly: `new_participant`
  - This is a hard requirement. The `continue.yml` workflow checks
    `contains(github.event.issue.labels.*.name, 'new_participant')` before
    processing any `/done N` command. If the label does not exist when the
    fork event fires, the tracking issue is created without it and the course
    will never advance, with no visible error.
  - Create the label once, before your first test fork.
4. Forking policy for private testing
  - In the upstream private repository: Settings -> General -> Features section.
  - Enable "Allow forking" so collaborators can fork the private repository.
  - Individual GitHub accounts can fork private repositories when this setting
    is on and the participant has been added as a collaborator. You do not need
    a GitHub organization for this to work.
  - The `fork` event fires in the upstream repository when a collaborator forks
    it, triggering `start.yml` and creating the tracking issue as expected.
5. Collaborator access for private testing
  - Add each test participant as a collaborator in the upstream repository
    (Settings -> Collaborators) before they fork and start the course.
  - Without collaborator access they cannot fork a private repository, comment
    on the upstream tracking issue, or trigger the course workflows.

## Optional future secret

This scaffold currently does not require an additional upstream write token beyond `GH_PAT_CROSSREPO`.

If future steps need cross-repository content edits, branch creation, or pull-request automation in other repositories, you can add a second secret such as `GH_PAT_UPSTREAM` and wire it into those future step scripts.

## Private repository reminder

Forking a private repository works for individual GitHub accounts provided:

1. "Allow forking" is enabled in the upstream repository (Settings -> General).
2. The participant has been added as a collaborator.
3. The `GH_PAT_CROSSREPO` secret is a classic Personal Access Token with
   `repo` scope. The `public_repo` scope is sufficient for public repositories
   but does not cover private repositories; using it with a private upstream
   will cause the issue-creation step to fail silently.

Images embedded via `{{IMAGE_BASE_URL}}` resolve to `raw.githubusercontent.com`
URLs, which require authentication for private repositories. They will not
render inside GitHub issue comments when the repository is private. Keep core
lesson text and commands in plain markdown text, and verify image rendering
during your first private test before relying on images.
