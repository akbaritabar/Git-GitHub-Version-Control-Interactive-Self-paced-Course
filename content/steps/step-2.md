## Step 2: Forks, Remotes, Branches, and Collaboration

This step moves from the basics to collaboration workflows.

### Forks

A fork is your own copy of a repository on GitHub.
It lets you experiment, learn, and contribute without directly changing the upstream repository.

Your fork for this course is:

- `{{FORK_REPO}}`

### Keeping a fork in sync

If the upstream repository changes, your fork can become outdated.
You should occasionally sync it with the upstream repository so your copy stays current.

### Clone, remotes, pull, and push

- `git clone <url>`: copy a repository to your computer
- `git remote -v`: inspect where your repository connects remotely
- `git pull`: bring remote changes into your local repository
- `git push`: send committed local changes to the remote repository

### Branches

Branches let you work on a feature, experiment, or revision without disturbing the main line of development.
That is useful for trying changes, reviewing work, and merging only when ready.

### Plain text and reproducibility

From your slides, an important advanced message is that Git and GitHub are not only for code.
They also support:

- plain-text writing workflows
- collaborative review
- versioned teaching material
- reproducible research projects
- release and archival workflows

### More advanced topics from the course

Your slides also introduce these directions for further learning:

- syncing forks and working with remotes
- using branches for experiments
- writing in plain text such as Markdown or LaTeX
- using Git in IDEs such as VS Code or RStudio
- GitHub Actions for automation
- GitHub Pages, releases, and research dissemination
- reproducibility links to OSF and Zenodo

### Next topics to learn

After you finish this two-step basic course, you can continue with these advanced directions from your slides and related reproducibility practice:

- workflow management with SnakeMake and Targets in R
- GitHub Actions for recurring automation tasks
- GitHub Pages and release workflows for sharing outputs
- R environments with `renv`
- Python environments with `uv`
- containerization with Docker or Podman for reproducible execution environments
- reproducibility and archival workflows with OSF and Zenodo

These topics help ensure that code, data, software environments, and analysis pipelines can be rerun and audited reliably.

### Your question for step 2

Reply in this tracking issue with a short answer to this question:

**Why might someone fork a repository, why might someone create a branch instead of working directly on the main branch, and name one advanced reproducibility tool or practice you want to learn next (for example SnakeMake, Docker/Podman, `renv`, `uv`, or GitHub Actions)?**

When you have answered, comment `/done 2` in this same tracking issue.

Tracking issue: {{TRACKING_ISSUE_URL}}
