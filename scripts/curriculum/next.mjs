#!/usr/bin/env node
/* eslint-disable no-console -- CLI prints next curriculum phase for agents */
/**
 * Print the next curriculum unit for the agent to execute.
 * Usage: npm run curriculum:next
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const run = spawnSync("node", ["scripts/curriculum/verify.mjs", "--json"], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
});
const raw = run.stdout;
if (!raw) {
  console.error(run.stderr || "verify.mjs produced no output");
  process.exit(1);
}
const { phases } = JSON.parse(raw);

const config = JSON.parse(
  fs.readFileSync(path.join(root, "curriculum.config.json"), "utf8")
);

const next = phases.find((p) => !p.pass && !p.optional);
const nextOptional = phases.find((p) => !p.pass && p.optional);

function printTarget(p) {
  if (!p) {
    console.log("All required curriculum phases pass verification.");
    console.log("Optional polish: npm run curriculum:verify — check SKIP? rows.");
    return;
  }
  const cfg = config.phases.find((x) => x.id === p.id);
  console.log(`Next phase: ${p.id} — ${p.title}`);
  if (cfg?.prompt) {
    console.log(`Agent prompt: @${cfg.prompt}`);
    console.log(`\nPaste into Cursor Agent:\n`);
    console.log(
      `Run the junior-to-senior auto-build for Phase ${p.id}. Read ${cfg.prompt} and .cursor/rules/curriculum-auto-build.mdc. Implement, then run npm run curriculum:verify && npm run build. Update REFACTOR_STATUS.md. One commit: refactor(phase${p.id}): <short title>. UI must not change.`
    );
  } else {
    console.log(`No prompt file — phase already satisfied or bundled in a parent phase.`);
    console.log(`Run: npm run curriculum:verify -- --phase ${p.id}`);
  }
}

if (next) {
  printTarget(next);
} else if (nextOptional) {
  console.log("Required phases complete. Next optional:");
  printTarget(nextOptional);
} else {
  printTarget(null);
}
