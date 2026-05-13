## Step 2: What is GitHub? Remote Repositories and Online Collaboration

This step introduces GitHub, i.e., the online platform where Git-tracked projects are hosted, shared, and collaborated on.

### What is GitHub?

**GitHub** is a hosting and collaboration platform built around Git repositories. While Git runs on your local computer, GitHub provides:

- Online storage for your repositories
- A web interface to browse, search, and discuss code or writing
- Tools for collaboration such as issues, comments, and pull requests
- Public visibility so others can find, fork, and learn from your work

Other similar platforms exist, e.g., GitLab, Bitbucket, Codeberg, and they all work with the same underlying Git tool.

### GitHub repositories

A **repository** (often called a "repo") is the project folder that Git tracks, stored on GitHub.

A common starting workflow is:

1. Create a new repository on GitHub (optionally with a README, `.gitignore`, and license)
2. Clone it to your computer with `git clone <url>`
3. Work locally, commit changes, and push them back to GitHub

### Fork a repository

**Forking** creates your own copy of someone else's repository on your GitHub account.

The fork remains **linked** to the original (upstream) so you can:

- Experiment without affecting the original
- Contribute changes back via a pull request
- Keep your own version of a project

**NOTE**: That is exactly what you did when you started this course! You forked this repository! Exciting!

### Keep your fork in sync

If the upstream repository changes after you fork, your fork can fall behind.
On GitHub, use the **Sync fork** button to bring those changes into your fork.

On the command line you could do:

```
git fetch upstream
git merge upstream/main
```

![Screenshot showing the Sync fork button on GitHub]({{IMAGE_BASE_URL}}/sync_your_fork_with_original_repository.PNG)

### Essential remote commands

- `git clone <url>`: copy a remote repository (with its full history) to your local computer. But the clone is not linked to the upstream, as it was the case with a fork (described above), and you do not have permission to contribute your changes back to the main repository if it is owned by someone else (you can only read/pull new changes).
- `git remote -v`: see where your local repository is connected remotely
- `git pull`: bring remote changes into your local branch
- `git push`: send your locally committed changes up to the remote repository

### My approach for starting a new project

One practical workflow: create an empty repository on GitHub (with a README, `.gitignore`, and license), clone it to your computer, then add your local files and start working. This avoids the `git init` + remote-setup dance.

Here is a photo showing where to obtain the url to use with git clone:


![Screenshot showing the clone URL on GitHub]({{IMAGE_BASE_URL}}/example_GitHub_clone_button.PNG)


### Your question for step 2

Please reply in this tracking issue with **2–4 full sentences in your own words**:

**What is GitHub and how is it different from Git? What does `git clone` do, and why would you run `git pull` before starting work on a shared project?**

Write as if you were explaining it to a colleague who has not used Git or GitHub before.
There is no need to quote or copy from the materials above — your own words are what matter.

**NOTE**: When you have answered, add `/done 2` to the same comment (Use `/done N` in a new line after your answer, with space between `/done` and N, where N is the step number) or in a new comment below.

Tracking issue: {{TRACKING_ISSUE_URL}}
