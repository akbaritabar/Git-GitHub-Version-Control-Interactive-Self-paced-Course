## Step 1: Why do we need Version Control? What is Git?

This step covers why version control matters and how Git works as a local tool on your computer.

### Why use version control?

A common problem in research and collaborative writing is ending up with many files such as:

- `paper_final.docx`
- `paper_final_revised.docx`
- `paper_final_revised_JS_2026-04-18.docx`
- `paper_REAL_final.docx`

That workflow becomes hard to search, hard to merge, and hard to trust.

In the photo below, you see an example from my own collaborative writing for a published article. We used dates to record the version of the file and find the latest one. We used name initials, i.e., `AA` is mine, and tracked who did the latest changes. Nonetheless, this is difficult and if you ask me what changed between two versions, I would not know precisely. 

Of course, you can think of running a review tab, compare on the two Word files, but how much can you learn from that and how easy will it be to track changes? Will it be easier if you had a short memo or note saying what happened?

![Example of a journal article folder using author initials and dates for versioning, this quickly becomes unmanageable]({{IMAGE_BASE_URL}}/example_of_journal_article_using_MS_Wod_name_initials_dates_still_hard.PNG)

Version control replaces that file-name chaos with a tracked and auditable history of changes.

You can compare it with ways to share files with others such as Google Drive, DropBox, NextCloud, OpenDrive and similar. But here, you share the files `alongside their history of changes`. This allows tracking what changed, when, and by whom.

An alternative could be using Google Docs, OpenOffice or something similar offering history of changes, but again, how easy/difficult is it to roll back the changes and go back to a prior version or branch out and open a completely new file and add experimental text that might later be excluded?

**Bottom line**: You should not be versioning files. Git, and other tools for version control, can do that perfectly. **You should focus on the content!**

### What is Git?

**Git** is a version control system. It records the history of your project, e.g., every change you commit is saved and can be revisited later.

Think of Git as an **endless `Ctrl+Z`** for your entire project, with labels and messages attached to each saved state.

Everything is backed up in Git's history if you stage and commit it (we will cover these topics later in the course).

At any moment, when you visit your project's folder, you have only one text file to edit for the code, the manuscript, etc., and Git keeps track of the history of changes made to that file. If you collaborate with someone (which will be covered in the next steps of this course), they will also have only one file to edit and all changes made are going to be merged into the same file allowing everyone to have the latest version of the file at all times.

Git runs on your **local computer** and does not require an internet connection. In Step 2 you will learn about GitHub, a separate service that adds online hosting and collaboration on top of Git.

### Why plain text matters

Plain text files work well with Git because changes can be compared line by line.
That is much harder with many binary formats such as `.docx` or `.xlsx`.

### How to install Git and use it locally?

For this interactive course, you do not need to install Git on your computer. But if you were interested to do so and try it out locally as we cover some basics below, use one of the links given here and install the one suitable for your operating system, e.g., Windows, Mac, or Linux.

You can download and install Git for:

- **Windows** (https://git-scm.com/downloads/win), 
- **Mac** (https://git-scm.com/downloads/mac) 
- **Linux** (https://git-scm.com/downloads/linux). 

**Please note**: no GUI installation is needed. Only follow the instructions in one of those links, depending on your operating system, and install the Git software. If you were asked for Windows installation to add "context menu shortcut" and "add Git to PATH" please select "yes" for both (which is also selected by default). 

After installing it, you can open Windows start menu and type `Git bash` or open a Terminal (which is the primary way on Mac and Linux) and type commands that will return outputs.

To confirm Git is installed before starting, type this in the terminal (or Git Bash) and press enter. It should print out the version of the git that is installed:

```
git --version

```

Alternatively, you can also download and install **GitHub Desktop** here [https://desktop.github.com/download/](https://desktop.github.com/download/) which offers you the same functionality using a Graphical User Interface (GUI) with buttons to click to run commands instead of typing them in a terminal to do things which is described below.


### Terminal basics

Before practicing Git commands you need a command-line interface (Terminal, Git Bash, or similar). You do not need to memorize everything at once, but these are some of the useful commands to know:

- `pwd`: show the current working directory/folder
- `ls` (on Mac and Linux) or `dir` (on Windows): list files in the folder
- `cd NAME-OF-FOLDER`: move into another directory



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

To create it, you right click and open a simple text file and replace its name, e.g., `new file.txt` with `.gitignore` (note: no name is added, and just an extension is used). You can open it with text editor like notepad and add patterns of files/folders to exclude.

### Keeping a clear project folder structure

A useful habit is to keep a clear project structure and stick to it.

Many research teams also use numbered scripts or workflow tools so the order of work is explicit and reproducible. This will be (through time) clear to you and your collaborators.

Here is an example of structure that I use often and a description is below what is included where and why.

![Example folder structure]({{IMAGE_BASE_URL}}/template_folder_structure_gitignore.PNG)


**Folder structure and logic**:

- `code`: R, Python, SQL, etc scripts allowing to run different steps. One would normally want all scripts in this folder to be version controlled using git to allow seeing what changed, when, by whom, and why.
- `inputs`: raw or unprocessed data files live here. We use code to process them (see the next point)
- `outputs`: processed data files are here. We use scripts in `code` folder to modify the `inputs` and save the resulting data files in `outputs`. Redoing the process is easy by re-running scripts in `code` and nothing is lost as we do not save any processed files under `inputs`.
- `figures`: visualizations files in PDF, PNG and other formats could be saved here. This makes it easier to find them but of course, these could be in a sub-folder under `outputs`, if needed.
- `writing backup`: here we can keep a backup of our writing and manuscript in plain text format (in case they are hosted online in an OverLeaf instance and so on, more on this below) which could read and use visualizations from `figures` folder.

If you are excited to learn more about how to use a `cookiecutter` tool for new projects and create the same folder structure over and over, I would recommend checking this repository where I use `cookiecutter` to recreate this folder structure for new projects: [https://github.com/akbaritabar/cookiecutter_projects_template](https://github.com/akbaritabar/cookiecutter_projects_template).

Later in the course you will learn about `scientific workflows and pipelines` and tools allowing you to maintain them. Some of those offer best-practices on how to manage your scripts, inputs and outputs which is described later. But, having a clear structure and sticking to it helps you in the long-term.


### Where to find more?

If you were interested to see some slides deck and PDF, consider going to [(https://github.com/akbaritabar/Using-Git-and-GitHub-for-Open-Science-Workshop)](https://github.com/akbaritabar/Using-Git-and-GitHub-for-Open-Science-Workshop) and follow the slides of my previous lecture. The following steps cover many of those topics here, but still, if you prefer seeing a slides deck, that is the option as well!


### Your question for step 1

Please reply in this tracking issue with **2–4 full sentences in your own words**:

**What is Git and what problem does it solve? Why is a `.gitignore` file useful?**

Write as if you were explaining it to a colleague who has never used version control.
There is no need to quote or copy from the materials above as your own words are what matter.

**NOTE**: When you have answered, add `/done 1` to the same comment or in a new comment below.

Tracking issue: {{TRACKING_ISSUE_URL}}
