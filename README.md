# Git, GitHub, and Version Control Interactive Course

This repository contains the current two-step version of a self-paced interactive course on Git, GitHub, version control, and reproducible collaboration.

The course structure and automation pattern are adapted from the repro-collab workshop by Aaron Peikert and collaborators. Replace this sentence with the final upstream repository URL or attribution wording you want to publish.

At the moment, this scaffold includes only step 1 and step 2.

## How the course starts

1. Visit the repository page.
2. Fork the repository to your own GitHub account.
3. The fork event creates a tracking issue in the main repository.
4. Open that issue and follow the instructions step by step.

The tracking issue is where the course advances. When a step asks you to answer a question, reply in the tracking issue. When you are ready to be checked, comment with the requested command such as `/done 1`.

## What the current version covers

- Step 1 introduces version control, Git, GitHub, `.gitignore`, terminal basics, and essential Git commands.
- Step 2 introduces forks, syncing, clone, pull, push, remotes, branches, and selected advanced GitHub and reproducibility topics.

This README describes only the current two-step version.

## Repository structure

- `content/steps/` contains the lesson text for step 1 and step 2.
- `content/questions/` contains the answer checks for step 1 and step 2.
- `images/` contains images that can be embedded in lesson markdown.
- `.github/workflows/` contains the automation.
- `.github/scripts/` contains the routing and validation logic.

## Private testing note

This course can be tested in a private repository if private forking is allowed and collaborators have access to the upstream repository. See `authoring.md` for the main caveats and required settings.
