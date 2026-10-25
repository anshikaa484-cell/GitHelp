// Common Git error messages with plain-English causes and fixes.
// Used by the Error Finder module (rule-based keyword matching, no backend).

let _e = 0;
const eid = () => `err-${++_e}`;

export const GIT_ERRORS = [
  {
    title: "fatal: not a git repository",
    severity: "Setup",
    keywords: ["not a git repository", "not a repository", ".git", "fatal: not"],
    cause: "You're running a Git command inside a folder that hasn't been initialised as a Git repository.",
    fix: ["git init", "# or move into an existing repo folder\ncd path/to/your-repo"],
  },
  {
    title: "Please tell me who you are",
    severity: "Setup",
    keywords: ["tell me who you are", "empty ident", "unable to auto-detect email", "please tell me who"],
    cause: "Git doesn't know your name/email yet, so it can't label your commits.",
    fix: [
      'git config --global user.email "you@example.com"',
      'git config --global user.name "Your Name"',
    ],
  },
  {
    title: "Updates were rejected (non-fast-forward)",
    severity: "Push",
    keywords: [
      "updates were rejected",
      "non-fast-forward",
      "failed to push some refs",
      "tip of your current branch is behind",
      "rejected",
    ],
    cause: "The remote has commits you don't have locally. Git won't overwrite them.",
    fix: ["git pull --rebase origin main", "# resolve any conflicts, then", "git push origin main"],
  },
  {
    title: "The current branch has no upstream branch",
    severity: "Push",
    keywords: ["no upstream branch", "has no upstream", "set the upstream", "--set-upstream"],
    cause: "You're pushing a new branch that isn't yet linked to a remote branch.",
    fix: ["git push -u origin <branch-name>"],
  },
  {
    title: "Merge conflict",
    severity: "Merge",
    keywords: ["merge conflict", "conflict (content)", "automatic merge failed", "fix conflicts", "conflict in"],
    cause: "The same lines were changed in two branches and Git can't decide which to keep.",
    fix: [
      "# open the conflicted files and edit between the <<<<<<< ======= >>>>>>> markers",
      "git add <resolved-file>",
      "git commit",
    ],
  },
  {
    title: "Your local changes would be overwritten",
    severity: "Checkout",
    keywords: [
      "local changes would be overwritten",
      "would be overwritten by checkout",
      "commit your changes or stash",
      "overwritten by merge",
    ],
    cause: "You have uncommitted changes that switching branches (or merging) would destroy.",
    fix: ["# save them temporarily\ngit stash", "git checkout <branch>", "# bring changes back\ngit stash pop"],
  },
  {
    title: "fatal: remote origin already exists",
    severity: "Remote",
    keywords: ["remote origin already exists", "origin already exists"],
    cause: "You tried to add a remote named 'origin' but one is already configured.",
    fix: ["git remote set-url origin <new-url>", "# or remove and re-add\ngit remote remove origin"],
  },
  {
    title: "fatal: refusing to merge unrelated histories",
    severity: "Merge",
    keywords: ["refusing to merge unrelated histories", "unrelated histories"],
    cause: "The two branches/repos have no common commit history (common after 'git init' on both sides).",
    fix: ["git pull origin main --allow-unrelated-histories"],
  },
  {
    title: "Permission denied (publickey)",
    severity: "Auth",
    keywords: ["permission denied", "publickey", "could not read from remote", "authentication failed"],
    cause: "GitHub can't verify your identity — usually a missing or unregistered SSH key.",
    fix: [
      'ssh-keygen -t ed25519 -C "you@example.com"',
      "# then add the printed public key to GitHub → Settings → SSH keys",
      "cat ~/.ssh/id_ed25519.pub",
    ],
  },
  {
    title: "You are in 'detached HEAD' state",
    severity: "Branch",
    keywords: ["detached head", "detached", "head state"],
    cause: "You checked out a specific commit instead of a branch, so new commits won't belong to any branch.",
    fix: ["# create a branch to keep your work\ngit switch -c my-new-branch", "# or go back\ngit switch main"],
  },
  {
    title: "error: failed to push some refs (protected branch)",
    severity: "Push",
    keywords: ["protected branch", "failed to push some refs", "cannot force-update", "hook declined"],
    cause: "The branch is protected on the remote — you can't push directly to it.",
    fix: ["git switch -c feature/my-change", "git push -u origin feature/my-change", "# then open a Pull Request"],
  },
  {
    title: "fatal: pathspec '...' did not match any files",
    severity: "Basic",
    keywords: ["did not match any files", "pathspec", "did not match"],
    cause: "The file or path you referenced doesn't exist or is misspelled.",
    fix: ["git status", "# check the exact name, then\ngit add <correct-file>"],
  },
].map((e) => ({ ...e, id: eid() }));
