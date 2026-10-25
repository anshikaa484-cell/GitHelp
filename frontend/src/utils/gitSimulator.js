// A tiny, deterministic Git SIMULATOR. It only edits a plain JavaScript object.
// It never runs real Git or shell commands and never talks to GitHub.

export const createRepo = () => ({
  initialized: false,
  branch: "main",
  branches: {}, // { branchName: [commit, ...] } newest last
  files: { "index.html": "untracked", "app.js": "untracked", "README.md": "untracked" },
});

export const EXAMPLES = [
  "git init",
  "git status",
  "git add .",
  'git commit -m "First commit"',
  "git log --oneline",
  "git switch -c feature",
  "git branch",
];

const tokenize = (s) => [...s.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((m) => m[1] ?? m[2] ?? m[3]);

// Small stable hash so commit ids look real but are always the same for the same message.
function fakeHash(text, n) {
  let h = 5381;
  for (const ch of `${text}${n}`) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

const names = (repo, state) => Object.keys(repo.files).filter((f) => repo.files[f] === state);

function status(repo) {
  const commits = repo.branches[repo.branch] || [];
  const staged = names(repo, "staged");
  const untracked = names(repo, "untracked");
  let out = `On branch ${repo.branch}\n`;
  if (!commits.length) out += "\nNo commits yet\n";
  if (staged.length) out += `\nChanges to be committed:\n${staged.map((f) => `\tnew file:   ${f}`).join("\n")}\n`;
  if (untracked.length) out += `\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n${untracked.map((f) => `\t${f}`).join("\n")}\n`;
  if (!staged.length && !untracked.length) out += "\nnothing to commit, working tree clean";
  return out.trimEnd();
}

// Returns { repo: newRepo, output: string }
export function runCommand(repo, input) {
  const parts = tokenize(input.trim());
  if (!parts.length) return { repo, output: "" };
  if (parts[0] !== "git") {
    return { repo, output: `Simulator: only git commands are supported here. Try one of the example commands.` };
  }
  const [, sub, ...args] = parts;
  const next = structuredClone(repo);

  if (sub === "init") {
    if (repo.initialized) return { repo, output: "Reinitialized existing Git repository in /project/.git/" };
    next.initialized = true;
    next.branches = { main: [] };
    return { repo: next, output: "Initialized empty Git repository in /project/.git/" };
  }
  if (!repo.initialized) {
    return { repo, output: "fatal: not a git repository (or any of the parent directories): .git\nHint: run `git init` first." };
  }
  const commits = next.branches[next.branch];

  switch (sub) {
    case "status":
      return { repo, output: status(repo) };

    case "add": {
      if (!args.length) return { repo, output: "Nothing specified, nothing added." };
      const targets = [".", "-A", "--all"].includes(args[0]) ? Object.keys(next.files) : args;
      for (const f of targets) {
        if (!(f in next.files)) return { repo, output: `fatal: pathspec '${f}' did not match any files\nFiles in this project: ${Object.keys(repo.files).join(", ")}` };
      }
      targets.forEach((f) => { if (next.files[f] === "untracked") next.files[f] = "staged"; });
      return { repo: next, output: "" };
    }

    case "commit": {
      let message = "";
      const i = args.findIndex((a) => a === "-m" || a === "-am" || a === "--message");
      if (i >= 0) message = args[i + 1] || "";
      else {
        const joined = args.find((a) => a.startsWith("--message=") || (a.startsWith("-m") && a.length > 2));
        if (joined) message = joined.startsWith("--message=") ? joined.slice(10) : joined.slice(2);
      }
      message = message.trim().replace(/^["']|["']$/g, "");
      if (!message) return { repo, output: 'Simulator: this playground needs a message. Use: git commit -m "your message"' };
      const staged = names(next, "staged");
      if (!staged.length) {
        return { repo, output: names(next, "untracked").length ? 'nothing added to commit but untracked files present (use "git add" to track)' : "nothing to commit, working tree clean" };
      }
      const hash = fakeHash(message, commits.length + Object.values(next.branches).flat().length);
      staged.forEach((f) => { next.files[f] = "committed"; });
      const root = commits.length === 0 ? " (root-commit)" : "";
      commits.push({ hash, message });
      return { repo: next, output: `[${next.branch}${root} ${hash}] ${message}\n ${staged.length} file${staged.length > 1 ? "s" : ""} changed` };
    }

    case "log": {
      if (!commits.length) return { repo, output: `fatal: your current branch '${repo.branch}' does not have any commits yet` };
      const list = [...commits].reverse();
      const output = args.includes("--oneline")
        ? list.map((c) => `${c.hash} ${c.message}`).join("\n")
        : list.map((c) => `commit ${c.hash}\nAuthor: You <you@example.com>\n\n    ${c.message}`).join("\n\n");
      return { repo, output };
    }

    case "branch": {
      if (!args.length) {
        return { repo, output: Object.keys(repo.branches).map((b) => `${b === repo.branch ? "*" : " "} ${b}`).join("\n") };
      }
      if (!commits.length) return { repo, output: `fatal: not a valid object name: '${repo.branch}'\nMake a first commit before creating branches.` };
      if (next.branches[args[0]]) return { repo, output: `fatal: a branch named '${args[0]}' already exists` };
      next.branches[args[0]] = [...commits];
      return { repo: next, output: "" };
    }

    case "switch":
    case "checkout": {
      const create = args[0] === "-c" || args[0] === "-b";
      const name = create ? args[1] : args[0];
      if (!name) return { repo, output: `Simulator: usage is git ${sub} <branch>` };
      if (create) {
        if (!commits.length) return { repo, output: "Simulator: make a first commit before creating branches." };
        if (next.branches[name]) return { repo, output: `fatal: a branch named '${name}' already exists` };
        next.branches[name] = [...commits];
        next.branch = name;
        return { repo: next, output: `Switched to a new branch '${name}'` };
      }
      if (!next.branches[name]) return { repo, output: `fatal: invalid reference: ${name}` };
      next.branch = name;
      return { repo: next, output: `Switched to branch '${name}'` };
    }

    default:
      return { repo, output: `Simulator: 'git ${sub}' is not supported in this playground.\nSupported: init, status, add, commit -m, log, branch, switch, checkout.\nSee the Commands page for everything else.` };
  }
}
