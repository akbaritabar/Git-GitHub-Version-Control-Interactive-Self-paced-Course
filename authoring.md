# Authoring Guide

This document explains how to maintain the current two-step interactive course.

## Content files you edit most often

- `content/steps/step-1.md`
- `content/steps/step-2.md`
- `content/questions/step-1.json`
- `content/questions/step-2.json`
- `images/`

The markdown files contain the lesson text that is posted as issue comments. The JSON files describe how participant answers are checked when they comment `/done N`.

## Files used by the current version

This version currently uses only:

- `content/steps/step-1.md`
- `content/steps/step-2.md`
- `content/questions/step-1.json`
- `content/questions/step-2.json`
- `.github/scripts/1.js`
- `.github/scripts/2.js`
- `.github/workflows/start.yml`
- `.github/workflows/continue.yml`

The parser already understands `/done N`. The step scripts check whether the participant has already posted a complete answer in the tracking issue.

## Markdown placeholders

The lesson markdown supports simple placeholders:

- `{{TRACKING_ISSUE_URL}}`
- `{{FORK_REPO}}`
- `{{IMAGE_BASE_URL}}`
- `{{UPSTREAM_REPO}}`
- `{{PARTICIPANT}}`

`{{IMAGE_BASE_URL}}` points to the repository's `images/` folder on the default branch. For example, the image markdown

`![Example]({{IMAGE_BASE_URL}}/example-placeholder.svg)`

will render the example placeholder image shipped with this scaffold.

## Question file format

Each file in `content/questions/` uses this format:

```json
{
  "step": 1,
  "prompt": "What the learner must answer before running /done 1",
  "requiredPatterns": [
    "git",
    "github",
    "version control"
  ],
  "failureMessage": "Short feedback shown when the answer is still missing or incomplete."
}
```

All `requiredPatterns` must match at least one earlier comment by the participant in the tracking issue. Matching is case-insensitive.

## Images

Put course images in `images/` and reference them from the lesson markdown using `{{IMAGE_BASE_URL}}/filename.ext`.

For public repositories, this works well with raw GitHub URLs.
For private repositories, image rendering in issue comments is less reliable because raw asset URLs are not public. For private testing, prefer text-first lessons or verify image visibility while logged in as a collaborator.

## Private repository testing

This course can be tested in a private repository, but all of the following must be true:

- The owner or organization allows private forks.
- Every tester has access to the upstream private repository.
- The upstream repository has the required Actions secrets.
- If the repository belongs to an organization, GitHub Actions settings for private forks must permit the workflows you need.

Important differences from the public version:

- Private forks stay private.
- Public GitHub Pages style asset links are not appropriate for private tests.
- Secrets are not exposed to workflows running in the fork, so keep privileged automation in the upstream repository.

## Required secrets

For the current two-step version, only one repository secret is needed in the upstream repository, meaning your original course repository:

- `GH_PAT_CROSSREPO`

`GH_PAT_CROSSREPO` is used by the upstream workflows to create and update the tracking issues in your main course repository.

You add it in your main repository on GitHub under:

- `Settings`
- `Secrets and variables`
- `Actions`
- `New repository secret`

Name the secret exactly `GH_PAT_CROSSREPO`.

For a public course repository, a classic personal access token with `public_repo` scope is typically enough.
For private testing, use a token with `repo` access.
