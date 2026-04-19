# Basics of Git, GitHub, and Version Control Interactive Course

This repository contains a self-paced interactive course on basics of Git, GitHub, version control, and reproducible collaboration. No prior knowledge is assumed. The only requirement is to have a GitHub account. You can **Sign up here**: [https://github.com/signup?](https://github.com/signup?).


## Credits and acknowledgements

The course's automated workflow is adapted from the `repro-collab` repository by Aaron Peikert et al. 2025, available in [https://github.com/aaronpeikert/repro-collab](https://github.com/aaronpeikert/repro-collab).

Since Aaron's course was, in my opinion, a bit advanced for a basic introduction, I revised the content substantially. The content here comes from my previous course on basics of Git, GitHub, and version control. The 2025 edition could be accessed here: [https://github.com/akbaritabar/Using-Git-and-GitHub-for-Open-Science-Workshop](https://github.com/akbaritabar/Using-Git-and-GitHub-for-Open-Science-Workshop).

In adapting the automated workflow to use it for my content I used multiple prompts and follow-up iterations with Claude Sonnet 4.6 and GPT 5.3 Codex to resolve issues. I have read and reviewed all lines of the GitHub workflow generated, ran multiple tests with different accounts to check everything from the instructor's and the student's perspective. I take full responsibility for the content and workflow of this interactive course. 

The course is publicly released under a `GNU GPL 3.0 license`, please feel free to use it to edit and teach Git, GitHub and version control (some instructions on how to set up the repository is provided under ".instructor_documents"). Opening issues with problems you faced is highly encouraged and appreciated.

## TODO before the course

You need to have a `GitHub` account to follow the Hands-on interactive course. **Sign up here**: [https://github.com/signup?](https://github.com/signup?)


## How the course starts

1. Visit the repository page.
2. Fork the repository to your own GitHub account.
3. The fork event creates a tracking issue in the main (this) repository.
4. Open that issue and follow the instructions step by step.

The tracking issue is where the course advances. When a step asks you to answer a question, reply by adding a comment in the tracking issue. When you are ready to be checked, comment with the requested command such as `/done 1` or `/done 2` etc. Both of these (your answer and done command) could be included in the same comment or two separate comments.

## What the current version covers

- Step 1 introduces version control, Git, why it matters, terminal basics, essential Git commands, and `.gitignore`.
- Step 2 introduces GitHub, repositories, forking, cloning, remote commands (`pull`, `push`, `clone`, `remote -v`), and syncing forks.
- Step 3 introduces branches, collaborative workflows, plain text for research, and connections to open science and reproducibility.
- Step 4 introduces advanced tools: Git in editors (VS Code, RStudio), Git aliases, GitHub Pages, GitHub Actions, workflow managers (SnakeMake, Targets), reproducible environments (`renv`, `uv`, Docker), and research archiving (OSF, Zenodo).


## Repository structure

- `content/steps/` contains the lesson text for steps 1–4.
- `images/` contains images that can be embedded in lesson markdown.
- `.github/workflows/` contains the automation process.
- `.github/scripts/` contains the routing and validation logic.
- `.instructor_documents/` contains instructor and maintenance documentation for those who wish to teach using these materials.
- `FAQ.md` includes Frequently Asked Questions/problems.

## Private testing note

This course can be tested in a private repository if private forking is allowed and collaborators have access to the upstream repository. For maintainer caveats and settings, see the instructor documentation in `.instructor_documents/`.

## Troubleshooting

If you run into problems — your personal archive is not updating, a step appears stuck, or you need to start over — see the [Frequently Asked Questions](FAQ.md) for step-by-step solutions.
