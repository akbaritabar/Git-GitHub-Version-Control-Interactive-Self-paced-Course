## Step 4: Advanced Git, GitHub Tools, and Reproducibility

This final step introduces tools and practices that extend what you can do with Git and GitHub — for research, scientific writing, and software development, e.g., developing an R package in collaboration with others.

### Git in popular integrated development environments (IDEs)

You do not have to use the terminal for every Git operation. Popular editors integrate Git directly.

**Visual Studio (VS) Code (highly recommended — multilingual and flexible):**

- Open a terminal in VS Code and use `git` commands directly
- The Source Control panel shows staged, unstaged, and committed files at a glance
- The extension **Git Graph** visualizes your commit history as a tree

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

Here is a photo showing how a `.gitconfig` file including that alias:

![Screenshot showing .gitconfig with alias definition]({{IMAGE_BASE_URL}}/git_alias.png)


Set one from the command line:

```
git config --global alias.st "status"
```

After that, `git st` runs `git status`. Over time, aliases like these save a lot of typing.

### GitHub Pages — publish directly from a repository

GitHub Pages turns a repository into a hosted website. Common uses:

- Personal or project websites.
    - For example, see Aliakbar Akbaritabar' website and portfolio here [https://akbaritabar.github.io/](https://akbaritabar.github.io/) which depends on GitHub actions that are being run on this repository to operate [https://github.com/akbaritabar/akbaritabar.github.io](https://github.com/akbaritabar/akbaritabar.github.io). 
    - Each time I create a new page, update my CV or add new files, do `git commit` and send my changes to repository using `git push`, it triggers GitHub actions and the website is updated (see photo below).
- Documentation for a code package
- Slide decks compiled from Markdown or HTML

The photo below shows my personal website (left) as an example that is using the codes in a GitHub repository (right) and each commit triggers GitHub actions and updates the website.

![Screenshot showing example GitHub pages for a website]({{IMAGE_BASE_URL}}/example_github_pages_and_repo.png)



### GitHub Actions — automation built into GitHub

GitHub Actions runs tasks automatically when you push code or open a pull request:

- Running tests to check that nothing is broken
- Compiling documents or building websites
- Deploying applications or data products

**NOTE**: This interactive course itself uses GitHub Actions for its automated workflow — every time you post a `/done N` command, a GitHub Action processes your answer and replies.

### Workflow management tools — pipelines with memory

For data analysis pipelines, workflow managers track dependencies between steps and only re-run steps whose inputs have changed:

- **SnakeMake**: Python-based, widely used in bioinformatics (e.g., for genome sequencing) and computational social science. Allows you to use R, Python, Julia, Rust, or bash scripts for your analysis workflow steps. 
  - NOTE: Your workflow can merge these languages and while you do your data preparation in Python, statistical modelling could happen in R and all of these are orchestrated by SnakeMake to run in parallel, if a step's input is not dependent on the other. If they do depend on each other, it runs the step in one language first, sees the exported output, and runs the next step in the other language/tool.
- **Targets** (R): the same idea for R-based workflows
- Both integrate naturally with version-controlled project structures as they use plain text file formats.

**NOTE**: If you are interested to see an example, check out this repository which is the code, data and files here that uses **SnakeMake** workflows: [https://github.com/akbaritabar/Internal-and-international-migration-of-scientists](https://github.com/akbaritabar/Internal-and-international-migration-of-scientists) and is the replication package for our publication here `A. Akbaritabar, M.J. Dańko,X. Zhao, & E. Zagheni (2025) Global subnational estimates of migration of scientists reveal large disparities in internal and international flows, Proc. Natl. Acad. Sci. U.S.A. 122 (15) e2424521122, https://doi.org/10.1073/pnas.2424521122.`.

This photo shows an example SnakeMake rule (or step) in the data processing and analysis workflow and how it depends on other steps' outputs (top) and how it is defined (bottom):

![Screenshot showing example SnakeMake rule or step]({{IMAGE_BASE_URL}}/example_snakemake_workflow_step.png)


### Reproducible environments — same code, same results

Code that runs on your machine may not run on a collaborator's. Virtual environment tools solve this:

- **`Renv`** (R): records and restores the exact R package versions used in a project
- **`uv`** (Python): fast modern Python environment and package manager
  - **`Cookiecutter`**: In step 1, you learned that having a consistent folder structure for your projects will pay off and make it easier to start. `uv` allows you to use a tool called `Cookiecutter` which creates the project folders, ReadMe files and descriptions, according to your wishes. 
  - Here is one example that I have set up to create new projects with the same structure with a few terminal commands using uv and Cookiecutter: [https://github.com/akbaritabar/cookiecutter_projects_template](https://github.com/akbaritabar/cookiecutter_projects_template)
- **`Docker / Podman`**: containerise the entire computing environment so any machine can reproduce the result exactly. On Mac and Linux, this is very straightforward, on Windows, you need Windows Subsystem for Linux (WSL) to be activated to use it.

**NOTE**: These will hopefully save you from having to say (or hear): *It works on my computer!*

### Plain text writing workflows

Git is not only for code. It works equally well for academic writing:

- **Markdown**: lightweight formatting for notes, READMEs, and web content. Everything you read in these comments and course's teaching materials were written using markdown syntax that supports whatever you need from bold, italic, code chunks etc. Cool, no?
- **R Markdown / Quarto**: combine text, description, and code in one document. It will render the R or Python code and show the figure/table/results alongside the text that describes them. This has been called `literate programming`.
- **LaTeX / Overleaf**: professional typesetting with full Git support. You can also consider using **Beamer** for presentation format using plain text or checkout Quarto presentations!
- **`latexdiff`**: a Perl script that shows tracked changes between two LaTeX versions — useful at the revise-and-resubmit stage when you send your paper to a journal and need to revise it and show what was changed and where.

### Archiving and sharing research outputs and replication packages

Once your project is ready to share:

- **OSF (Open Science Framework)**: create a project, upload materials, share a view-only link for peer review. See here [https://help.osf.io/article/201-create-a-view-only-link-for-a-project](https://help.osf.io/article/201-create-a-view-only-link-for-a-project)
- **Zenodo**: create a GitHub Release, connect the repository to Zenodo, and automatically receive a DOI suitable for citation

Here is an example of a Zenodo repository sharing code, data and materials for the publication linked earlier: [https://doi.org/10.5281/zenodo.15047102](https://doi.org/10.5281/zenodo.15047102). 

**Q**: Did you know that you can directly link and sync your GitHub repository with both OSF and Zenodo? Great!


### Where to go next?

- [GitHub Skills](https://skills.github.com/) — interactive GitHub learning paths
- [GitHub Education cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf) — command reference card
- [Atlassian Git tutorials](https://www.atlassian.com/git/tutorials/) — thorough written tutorials covering beginner to advanced topics
- [Article discussing reproducibility issues: Open Science Collaboration. (2015). Estimating the reproducibility of psychological science. Science, 349(6251), aac4716–aac4716. https://doi.org/10.1126/science.aac4716](https://doi.org/10.1126/science.aac4716)

### Your question for step 4

Please reply in this tracking issue with **2–4 full sentences in your own words**:

**Pick one tool or practice from this step — for example a Git alias, GitHub Actions, SnakeMake, Docker, Renv, Zenodo, or GitHub Pages — and explain briefly what it does and how it could help your own work or research.**

Write in your own words. There is no need to quote or copy from the materials above.

**NOTE**: When you have answered, add `/done 4` to the same comment or in a new comment below.

Tracking issue: {{TRACKING_ISSUE_URL}}
