import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

function sh(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function getArgValue(flag) {
  const arg = process.argv.find((item) => item.startsWith(`${flag}=`));
  return arg ? arg.split("=")[1] : undefined;
}

const baseBranch = getArgValue("--base") || "main";
const sourceBranch = getArgValue("--branch") || sh("git branch --show-current");

if (["main", "master", "develop"].includes(sourceBranch)) {
  throw new Error("No se generan release notes automáticas desde ramas protegidas.");
}

const commitsRaw = sh(`git log --no-merges --pretty=format:%s ${baseBranch}..${sourceBranch}`);
const commits = commitsRaw ? commitsRaw.split("\n").filter(Boolean) : [];

const date = new Date().toISOString().slice(0, 10);
const sectionTitle = `## ${date} - cierre de rama \`${sourceBranch}\``;
const sectionMeta = `Base: \`${baseBranch}\``;
const sectionItems = commits.length
  ? commits.map((message) => `- ${message}`).join("\n")
  : "- Sin commits nuevos respecto a la rama base.";
const section = `${sectionTitle}\n${sectionMeta}\n${sectionItems}`;

const notesPath = "RELEASE_NOTES.md";
const header = "# Release Notes\n\n";
const existing = existsSync(notesPath) ? readFileSync(notesPath, "utf8") : "";

const normalizedBody = existing.startsWith(header)
  ? existing.slice(header.length).trimStart()
  : existing.trimStart();

// Mantiene el historial al principio para ver el cierre mas reciente primero.
const nextContent = `${header}${section}${normalizedBody ? `\n\n${normalizedBody}` : ""}\n`;

writeFileSync(notesPath, nextContent, "utf8");
console.log(`Release notes actualizadas en ${notesPath}`);
