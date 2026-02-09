import { execSync } from "node:child_process";

function sh(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit" });
}

const baseBranch = process.env.BASE_BRANCH || "main";
const currentBranch = sh("git branch --show-current");

if (["main", "master", "develop"].includes(currentBranch)) {
  throw new Error("Debes ejecutar close-branch desde una rama de trabajo.");
}

if (sh("git status --porcelain")) {
  throw new Error("El arbol de trabajo no esta limpio. Haz commit o stash antes de cerrar rama.");
}

// Genera notas de release a partir de los commits de la rama antes de fusionar.
run(`node scripts/generate-release-notes.mjs --base=${baseBranch} --branch=${currentBranch}`);
run("git add RELEASE_NOTES.md");
run(`git commit -m "docs(release): actualiza notas de cierre de rama ${currentBranch}"`);

// Validacion obligatoria solicitada antes de integrar en la rama base.
run("npm run doctor");

run(`git checkout ${baseBranch}`);
run(`git pull --ff-only origin ${baseBranch}`);
run(`git merge --ff-only ${currentBranch}`);
run(`git push origin ${baseBranch}`);
run(`git branch -d ${currentBranch}`);

try {
  run(`git push origin --delete ${currentBranch}`);
} catch {
  console.log("La rama remota no existia; se omite su borrado.");
}

console.log(`Rama ${currentBranch} cerrada correctamente sobre ${baseBranch}.`);
