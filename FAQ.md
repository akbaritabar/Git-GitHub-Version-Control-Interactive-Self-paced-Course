# Frequently Asked Questions

This page collects common problems participants encounter and explains how to resolve them.

---

## Q1: My personal archive in my fork is not being updated

**What the personal archive is:**
After you complete each step, the course automatically saves a copy of the teaching materials to a special issue called *"Course Materials Archive — Git/GitHub Interactive Course"* inside your own fork. This gives you a personal reference to come back to later. Please note: your progress in the course continues in the issue created in the main repository that is on instructor's GitHub page.

**Why the personal archive issue might not be updating:**
The most common reason is that **Issues are not enabled in your fork**. GitHub turns Issues off by default in all forks, so you need to enable them manually **before you complete Step 1**. The archive issue is created automatically when you submit your first valid answer — if Issues are disabled at that moment, no archive issue is created.

> **NOTE:** The archive is attempted again at Steps 2, 3, and 4 as a fallback. If you enabled Issues after Step 1 was already completed, completing the next step will still create the archive and save that step's content. Earlier steps' content will not be retroactively added, but you can find everything in your tracking issue.

**How to enable Issues in your fork:**

1. Go to your fork on GitHub — the URL looks like (open in a new tab so that once done you can continue the interactive course in the instructor's repository):
   `https://github.com/YOUR_USERNAME/YOUR_FORK_NAME`
2. Click the **Settings** tab at the top of the repository page
3. Scroll down until you see the **Features** section
4. Check the box next to **Issues**
5. Reload the page to confirm Issues is now showing as a tab

Once Issues is enabled, the archive will be created when you complete the next step in the instructor's repository.

**NOTE:** The archive is a personal reference only. Your course progress in the upstream tracking issue is completely separate and is never affected by this setting.

---

## Q2: Something broke and my course is stuck — how do I re-start?

There are several situations where a step might appear stuck:

- You commented `/done 1` and nothing happened (no reply appeared within a few minutes)
- A workflow run shows a red ✗ (failed) in the Actions tab of the upstream repository
- The course tracking issue was accidentally edited and the checklist or metadata lines were changed
- You are not sure which tracking issue is yours

The cleanest way to recover is to **delete your fork and fork the repository again**. The course will restart completely from Step 1 with a fresh tracking issue and a fresh enrollment record. Your old issues will be automatically closed and labelled as superseded.

### Steps to delete your fork

> ⚠️ **This permanently deletes your fork.** Any changes you committed to your fork will be lost. Make sure you have not stored anything important there before continuing.

1. Go to your fork on GitHub (open in a new tab so that once done you can continue the interactive course in the instructor's repository):
   `https://github.com/YOUR_USERNAME/YOUR_FORK_NAME`
2. Click the **Settings** tab at the top
3. Scroll all the way to the bottom of the page — this section is called the **Danger Zone**
4. Click **Delete this repository**
5. GitHub will ask you to type the full repository name (for example `YOUR_USERNAME/YOUR_FORK_NAME`) to confirm
6. Click the red **I understand the consequences, delete this repository** button

### Fork the repository again to restart

1. Go to the original (upstream) course repository — your instructor will have shared this link
2. Click the **Fork** button near the top right of the page
3. Choose your own GitHub account as the destination
4. Wait about 1–2 minutes for the automation to run
5. Go to the Issues tab of the **upstream** (instructor's) repository, **not your fork**

### Finding your new tracking issue

After re-forking, two new issues will be created automatically in the upstream repository:

- An **enrollment record** titled `[Enrollment] @YOUR_USERNAME`
- Your **course tracking issue** titled `@YOUR_USERNAME started the Git/GitHub interactive course`

The enrollment record contains a direct link to your tracking issue. Your tracking issue is where your interactive course happens.

To find them quickly:
- Go to the upstream repository Issues tab
- Search for your GitHub username in the search bar
- Or filter by the `new_participant` label

Your old (broken) tracking issue will have been automatically closed and will appear under "Closed" issues.

---

## Q3: I posted my answer but the course said it is not complete yet

The course checks your answer automatically. If it says your answer is not complete, it will tell you what to improve. Here are tips for writing an answer that passes:

- **Write in your own words.** You do not need to copy or quote from the course materials. Explain the concepts as if talking to a colleague.
- **Write full sentences.** A list of single words or isolated terms usually will not pass. Write at least 2–4 full sentences.
- **Cover the key ideas.** Read the failure message carefully — it tells you which parts of the question were not covered.
- **You can try again.** Simply post a new comment with your improved answer, then add `/done N` (where N is the step number). The course checks your most recent answer, so you do not need to edit previous comments.

---

## Q4: Someone else commented on my tracking issue and it replied to them

The course is set up so that only the registered participant (you) can advance steps. If someone else posts a `/done N` command in your tracking issue, the course will reply telling them they are not the registered participant, but it will not advance the course.

If you receive a confusing reply you did not expect, check whether someone else has commented in your issue. The course reply always addresses the correct participant name.

---

## Q5: I accidentally edited the tracking issue body and the checklist or metadata changed

The course stores important information in the body of your tracking issue (participant name, fork URL, step checklist, and archive link). **Do not edit the issue body.** If you have accidentally changed it:

1. Contact your instructor and explain what happened
2. The instructor can look at the issue's edit history (click the pencil icon on the issue body → "edited N minutes ago") and manually restore the original content
3. The metadata lines that must be preserved are:
   - Participant: `username`
   - Fork repo: `owner/repo`
   - Fork sha: `sha`
   - Enrollment issue: `#N`
   - Fork archive: `<url or disabled>`
   - The two checklist lines starting with `- [ ]` or `- [x]`

---

## Q6: I accidentally closed the tracking issue — how do I continue?

**Good news: closing the issue does not break the course.**

GitHub still fires comment notifications on closed issues, and the course automation listens for those events regardless of whether the issue is open or closed. The `new_participant` label is preserved when you close the issue. So the course is still fully functional.

**How to continue:**

1. Go to the upstream (instructor's) repository Issues tab
2. If your issue is not visible in the default "Open" view, click **Closed** to see closed issues
3. Find your tracking issue (titled `@YOUR_USERNAME started the Git/GitHub interactive course`)
4. Click **Reopen issue** at the bottom of the page

Once reopened, continue posting your answer and `/done N` commands exactly as before. Nothing is lost.

> **Tip:** If you already have a valid answer ready, you can post it together with `/done N` even while the issue is closed. A valid answer will cause the automation to automatically reopen the issue as part of processing your step — you do not even need to reopen it manually first.

**You do not need to delete your fork or restart the course.** The fork-delete approach in Q2 is only for situations where the tracking issue itself is damaged (edited body, corrupted checklist, failed workflow).
