## Step 4: Advanced Git, GitHub Tools, and Reproducibility

This final step introduces tools and practices that extend what you can do with Git and GitHub — for professional research, scientific writing, and software development.

### Git in popular editors

You do not have to use the terminal for every Git operation. Popular editors integrate Git directly.

**VS Code (highly recommended — multilingual and flexible):**

- Open a terminal in VS Code and use `git` commands directly
- The Source Control panel shows staged, unstaged, and committed files at a glance
- The extension **Git Graph** visualises your commit history as a tree

**RStudio:**

- Add the git executable path in Global Options → Version Control
- Use the Git pane to stage, commit, and push without leaving the editor
- Open the terminal inside RStudio for more advanced commands

### Git aliases — type less, do more

You can shorten long Git commands with **aliases** defined in your `.gitconfig` file:

```ini
[alias]
  st  = status
  cm  = commit -m
  ad  = add -A
  pl  = pull --all
  ps  = push --all
  df  = diff --color-words
  lg  = log --pretty=format:'%C(auto)%h%C(blue) %<|(19)%as%C(auto)%d %s'
```

Set one from the command line:

```
git config --global alias.st "status"
```

After that, `git st` runs `git status`. Over time, aliases like these save a lot of typing.

### GitHub Pages — publish directly from a repository

GitHub Pages turns a repository into a hosted website. Common uses:

- Personal or project websites
- Documentation for a code package
- Slide decks compiled from Markdown or HTML

### GitHub Actions — automation built into GitHub

GitHub Actions runs tasks automatically when you push code or open a pull request:

- Running tests to check that nothing is broken
- Compiling documents or building websites
- Deploying applications or data products

This interactive course itself uses GitHub Actions for its automated workflow — every time you post a `/done N` command, a GitHub Action processes your answer and replies.

### Workflow management tools — pipelines with memory

For data analysis pipelines, workflow managers track dependencies between steps and only re-run steps whose inputs have changed:

- **SnakeMake**: Python-based, widely used in bioinformatics and computational social science
- **Targets** (R): the same idea for R-based workflows
- Both integrate naturally with version-controlled project structures

### Reproducible environments — same code, same results

Code that runs on your machine may not run on a collaborator's. Environment tools solve this:

- **`renv`** (R): records and restores the exact package versions used in a project
- **`uv`** (Python): fast modern Python environment and package manager
- **Docker / Podman**: containerise the entire computing environment so any machine can reproduce the result exactly

### Plain text writing workflows

Git is not only for code. It works equally well for academic writing:

- **Markdown**: lightweight formatting for notes, READMEs, and web content
- **R Markdown / Quarto**: combine prose and code in one document
- **LaTeX / Overleaf**: professional typesetting with full Git support
- **`latexdiff`**: a Perl script that shows tracked changes between two LaTeX versions — useful at the revise-and-resubmit stage

### Archiving and sharing research outputs

Once your project is ready to share:

- **OSF (Open Science Framework)**: create a project, upload materials, share a view-only link for peer review
- **Zenodo**: create a GitHub Release, connect the repository to Zenodo, and automatically receive a DOI suitable for citation

### Where to go next

- [GitHub Skills](https://skills.github.com/) — interactive GitHub learning paths
- [GitHub Education cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf) — command reference card
- [Atlassian Git tutorials](https://www.atlassian.com/git/tutorials/) — thorough written tutorials covering beginner to advanced topics

### Your question for step 4

Please reply in this tracking issue with **2–4 full sentences in your own words**:

**Pick one tool or practice from this step — for example a Git alias, GitHub Actions, SnakeMake, Docker, `renv`, Zenodo, or GitHub Pages — and explain briefly what it does and how it could help your own work or research.**

Write in your own words. There is no need to quote or copy from the materials above.

When you have answered, add `/done 4` to the same comment or in a new comment below.

Tracking issue: {{TRACKING_ISSUE_URL}}
