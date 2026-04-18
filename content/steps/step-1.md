## Step 1: Why Version Control, What Git, What GitHub?

This step covers the foundations.

### Why use version control?

A common problem in research and collaborative writing is ending up with many files such as:

- `paper_final.docx`
- `paper_final_revised.docx`
- `paper_final_revised_JS_2026-04-18.docx`
- `paper_REAL_final.docx`

That workflow becomes hard to search, hard to merge, and hard to trust.

Version control replaces that file-name chaos with a tracked and auditable history of changes.

![Placeholder for your Word-versioning example image]({{IMAGE_BASE_URL}}/example-placeholder.svg)

You can later replace that placeholder with your slide image that demonstrates the same versioning problem.

### Git and GitHub

- Git is the version control system. It records the history of your project.
- GitHub is a hosting and collaboration platform built around Git repositories.
- Git lets you track changes locally.
- GitHub makes it easier to share, review, discuss, and collaborate on those tracked changes.

### Why plain text matters

Plain text files work well with Git because changes can be compared line by line.
That is much harder with many binary formats.

### Terminal basics

You do not need to memorize everything at once, but you should recognize the role of these commands in day-to-day project work:

- `pwd`: show the current working directory
- `ls` or `dir`: list files
- `cd`: move into another directory

Before practicing commands, confirm Git is installed:

- `git --version`

### Essential Git commands

- `git config --list`: inspect your Git configuration
- `git config --global user.name "Your Name"`: set your name
- `git config --global user.email "you@example.org"`: set your email
- `git init`: start a local Git repository
- `git status`: inspect changed, staged, or untracked files
- `git add <file>`: stage changes for the next commit
- `git commit -m "message"`: record staged changes in history
- `git log`: inspect commit history
- `git diff --color-words`: inspect changes before or after staging

### What is `.gitignore`?

A `.gitignore` file tells Git which files or patterns should not be tracked.
This is useful for generated files, logs, temporary files, secrets, and machine-specific clutter.

Examples:

- `logs/`
- `*.tmp`
- `.DS_Store`
- `.env`

### Folder structure habit

From your slides, one useful habit is to keep a clear project structure and stick to it.
Many research teams also use numbered scripts or workflow tools so the order of work is explicit and reproducible.

### Your question for step 1

Reply in this tracking issue with a concise answer in full sentences:

**What is the difference between Git and GitHub, and why might a `.gitignore` file be useful?**

When you have answered, comment `/done 1` in this same tracking issue.

Tracking issue: {{TRACKING_ISSUE_URL}}
