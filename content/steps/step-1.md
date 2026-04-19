## Step 1: Why Version Control? What is Git?

This step covers why version control matters and how Git works as a local tool on your computer.

### Why use version control?

A common problem in research and collaborative writing is ending up with many files such as:

- `paper_final.docx`
- `paper_final_revised.docx`
- `paper_final_revised_JS_2026-04-18.docx`
- `paper_REAL_final.docx`

That workflow becomes hard to search, hard to merge, and hard to trust.

Version control replaces that file-name chaos with a tracked and auditable history of changes.

![Example of a journal article folder using author initials and dates for versioning — this quickly becomes unmanageable]({{IMAGE_BASE_URL}}/example_of_journal_article_using_MS_Wod_name_initials_dates_still_hard.PNG)

### What is Git?

**Git** is a version control system. It records the history of your project — every change you commit is saved and can be revisited later.

Think of Git as an endless "Ctrl+Z" for your entire project, with labels and messages attached to each saved state.

Git runs on your **local computer** and does not require an internet connection. In Step 2 you will learn about GitHub, a separate service that adds online hosting and collaboration on top of Git.

### Why plain text matters

Plain text files work well with Git because changes can be compared line by line.
That is much harder with many binary formats such as `.docx` or `.xlsx`.

### Terminal basics

Before practicing Git commands you need a command-line interface (Terminal, Git Bash, or similar). You do not need to memorise everything at once:

- `pwd`: show the current working directory
- `ls` or `dir`: list files
- `cd`: move into another directory

Confirm Git is installed before starting:

```
git --version
```

### Essential Git commands

- `git config --list`: inspect your Git configuration
- `git config --global user.name "Your Name"`: set your name
- `git config --global user.email "you@example.org"`: set your email
- `git init`: start a local Git repository in the current folder
- `git status`: inspect changed, staged, or untracked files
- `git add <file>`: stage changes for the next commit
- `git commit -m "message"`: record staged changes in history
- `git log`: inspect commit history
- `git diff --color-words`: inspect word-level changes before or after staging

### What is `.gitignore`?

A `.gitignore` file tells Git which files or patterns should **not** be tracked.
This is useful for generated files, logs, temporary files, secrets, and machine-specific clutter.

Examples:

- `logs/`
- `*.tmp`
- `.DS_Store`
- `.env`

A good habit is to set up your `.gitignore` early so you never accidentally commit sensitive credentials or large generated files.

### Folder structure habit

A useful habit is to keep a clear project structure and stick to it.
Many research teams also use numbered scripts or workflow tools so the order of work is explicit and reproducible.

### Your question for step 1

Please reply in this tracking issue with **2–4 full sentences in your own words**:

**What is Git and what problem does it solve? Why is a `.gitignore` file useful?**

Write as if you were explaining it to a colleague who has never used version control.
There is no need to quote or copy from the materials above — your own words are what matter.

When you have answered, add `/done 1` to the same comment or in a new comment below.

Tracking issue: {{TRACKING_ISSUE_URL}}
