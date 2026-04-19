## Step 3: Branches, Collaboration, and Open Science

This step covers how branches and collaborative workflows work, and how version control connects to open and reproducible research.

### Branches

A **branch** lets you work on a feature, experiment, or revision without disturbing the main line of development.

- The default branch is usually called `main` (or `master` in older repositories)
- Creating a branch gives you a safe space to try changes
- When you are ready, you can **merge** the branch back into main

Common use cases:

- Trying out a new idea without risking your working code or text
- Working on multiple features or sections in parallel
- Letting others review a proposed change before it reaches main

Basic branch commands:

```
git branch feature-idea        # create a new branch
git checkout feature-idea      # switch to it
git checkout -b feature-idea   # create and switch in one command
git merge feature-idea         # merge back into main when ready
```

### Pull requests

A **pull request** (PR) on GitHub is a formal way to propose merging one branch (or fork) into another. It allows:

- Discussion and review of the proposed changes
- Automated checks (GitHub Actions)
- A permanent record of why and how a change was made

### Collaboration workflow

A typical open-source or team collaboration workflow:

1. Fork the upstream repository (your own copy on GitHub)
2. Clone your fork locally
3. Create a branch for your work
4. Commit changes and push to your fork
5. Open a pull request from your branch to the upstream repository
6. The maintainer reviews and merges

This keeps the main repository clean and gives the maintainer control over what is merged.

### Plain text and reproducibility

Plain text formats such as **Markdown**, **R Markdown**, and **LaTeX** work naturally with Git:

- Every word change shows up as a line-level diff
- It is easy to track contributions and collaborate on writing
- Documents can be compiled from source, ensuring reproducibility

Version-controlled writing means the full history of a manuscript is as transparent as the history of code.

### Open Science connections

Version control directly supports Open Science practices:

- **Transparency**: your analysis and writing history is auditable
- **Replication**: collaborators can exactly reproduce your steps from the same starting point
- **Sharing**: a GitHub repository can be published with a DOI on Zenodo or linked to the Open Science Framework (OSF)
- **Automation**: GitHub Actions can run tests, compile documents, or build websites automatically when you push new commits

### Your question for step 3

Please reply in this tracking issue with **2–4 full sentences in your own words**:

**Why would you create a branch instead of working directly on the main branch? What does forking a repository mean, and how is a fork different from a clone?**

Write as if you were explaining it to a colleague who has not used Git or GitHub before.
There is no need to quote or copy from the materials above — your own words are what matter.

When you have answered, add `/done 3` to the same comment or in a new comment below.

Tracking issue: {{TRACKING_ISSUE_URL}}
