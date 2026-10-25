export const LESSONS = [
  { id: "setup", level: "beginner", title: "Set up Git and your identity", summary: "Install Git and set user.name and user.email so commits carry your name.", command: "git config --global user.name \"Your Name\"" },
  { id: "init-clone", level: "beginner", title: "Create or copy a repository", summary: "Use git init for a new project or git clone to copy an existing one.", command: "git init" },
  { id: "stage-commit", level: "beginner", title: "Stage and commit a change", summary: "Check git status, stage with git add, then save a snapshot with git commit.", command: "git add .\ngit commit -m \"Describe your change\"" },
  { id: "branches", level: "intermediate", title: "Work on branches", summary: "Create a branch for each task, switch between them, and merge when finished.", command: "git switch -c feature/login" },
  { id: "remotes", level: "intermediate", title: "Sync with a remote", summary: "Understand fetch, pull and push, and set the upstream on the first push.", command: "git push -u origin main" },
  { id: "undo", level: "advanced", title: "Undo changes safely", summary: "Choose between restore, revert and reset depending on whether work is shared.", command: "git revert <commit>" },
  { id: "conflicts", level: "advanced", title: "Resolve a merge conflict", summary: "Edit the conflict markers, stage the file, and finish the merge.", command: "git add <file>\ngit commit" },
];
