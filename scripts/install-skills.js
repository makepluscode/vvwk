#!/usr/bin/env node
/**
 * Installs skills from skills-lock.json into .claude/skills/
 * Reads the project-local lock file instead of the global one.
 *
 * Usage:
 *   node scripts/install-skills.js
 *   node scripts/install-skills.js --target .agents/skills
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = process.cwd();
const LOCK_FILE = path.join(ROOT, "skills-lock.json");
const DEFAULT_TARGET = path.join(ROOT, ".claude", "skills");

const args = process.argv.slice(2);
const targetIdx = args.indexOf("--target");
const TARGET = targetIdx !== -1 ? path.resolve(args[targetIdx + 1]) : DEFAULT_TARGET;

if (!fs.existsSync(LOCK_FILE)) {
  console.error("skills-lock.json not found. Run from project root.");
  process.exit(1);
}

const lock = JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
const skills = lock.skills || {};

// Group skills by source repo to minimize clone operations
const byRepo = {};
for (const [name, meta] of Object.entries(skills)) {
  if (meta.sourceType !== "github") continue;
  if (!byRepo[meta.source]) byRepo[meta.source] = [];
  byRepo[meta.source].push({ name, ...meta });
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vvwk-skills-"));
fs.mkdirSync(TARGET, { recursive: true });

let installed = 0;
let failed = 0;

for (const [repo, repoSkills] of Object.entries(byRepo)) {
  const repoDir = path.join(tmpDir, repo.replace("/", "__"));
  const cloneUrl = `https://github.com/${repo}.git`;

  console.log(`\nCloning ${repo}...`);
  try {
    execSync(`git clone --filter=blob:none --sparse "${cloneUrl}" "${repoDir}"`, {
      stdio: "pipe",
    });
  } catch {
    console.error(`  ✗ Failed to clone ${repo}`);
    failed += repoSkills.length;
    continue;
  }

  // Collect unique sparse-checkout paths (parent dirs of SKILL.md)
  const sparsePaths = [
    ...new Set(repoSkills.map((s) => path.dirname(s.skillPath).replace(/\\/g, "/"))),
  ];

  try {
    execSync(`git -C "${repoDir}" sparse-checkout set ${sparsePaths.join(" ")}`, {
      stdio: "pipe",
    });
  } catch {
    console.error(`  ✗ sparse-checkout failed for ${repo}`);
    failed += repoSkills.length;
    continue;
  }

  for (const skill of repoSkills) {
    const skillDir = path.join(repoDir, path.dirname(skill.skillPath));
    const destDir = path.join(TARGET, skill.name);

    if (!fs.existsSync(skillDir)) {
      console.error(`  ✗ ${skill.name} — source dir not found`);
      failed++;
      continue;
    }

    fs.rmSync(destDir, { recursive: true, force: true });
    copyDir(skillDir, destDir);
    console.log(`  ✓ ${skill.name}`);
    installed++;
  }
}

// Cleanup
fs.rmSync(tmpDir, { recursive: true, force: true });

console.log(`\n${installed} skill(s) installed to ${TARGET}`);
if (failed > 0) console.warn(`${failed} skill(s) failed.`);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}
