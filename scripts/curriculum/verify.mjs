#!/usr/bin/env node
/**
 * Automated exit-criteria checks for junior-to-senior curriculum.
 * Usage: node scripts/curriculum/verify.mjs [--json] [--phase 3d]
 */
import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const jsonOut = process.argv.includes("--json");
const phaseFilter = (() => {
  const i = process.argv.indexOf("--phase");
  return i >= 0 ? process.argv[i + 1] : null;
})();

const SKIP_DIRS = new Set(["node_modules", ".nuxt", ".output", ".git", "dist"]);

function globToRegExp(glob) {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "{{GLOBSTAR}}")
    .replace(/\*/g, "[^/]*")
    .replace(/{{GLOBSTAR}}/g, ".*");
  return new RegExp(`^${escaped}$`);
}

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(full, files);
    else files.push(full);
  }
  return files;
}

function rgFallback(pattern, globs) {
  const re = new RegExp(pattern);
  const matchers = globs.map(globToRegExp);
  const hits = [];
  for (const file of walkFiles(root)) {
    const rel = path.relative(root, file).replaceAll("\\", "/");
    if (!matchers.some((m) => m.test(rel))) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const line of text.split("\n")) {
      if (re.test(line)) hits.push(`${rel}:${line}`);
    }
  }
  return hits.join("\n");
}

function rg(pattern, globs = ["*.vue", "*.js", "*.ts"]) {
  const args = ["-n", pattern];
  for (const g of globs) args.push("--glob", g);
  args.push(".", "--glob", "!node_modules", "--glob", "!.nuxt");
  const r = spawnSync("rg", args, { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  if (r.error?.code === "ENOENT") return rgFallback(pattern, globs);
  if (r.error || r.status === 2) return "";
  if (r.status === 1) return "";
  return (r.stdout || "").trim();
}

function rgCount(pattern, globs) {
  const out = rg(pattern, globs);
  if (!out) return 0;
  return out.split("\n").filter(Boolean).length;
}

function fileExists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function run(cmd) {
  try {
    execSync(cmd, { cwd: root, encoding: "utf8", stdio: "pipe" });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e.stderr || e.message || "").toString().slice(0, 500) };
  }
}

function check(name, pass, detail = "") {
  return { id: name, pass, detail };
}

const checks = {
  phase0: () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    const items = [
      check("eslint.config", fileExists("eslint.config.mjs")),
      check("husky", fileExists(".husky/pre-commit")),
      check("vitest", fileExists("vitest.config.ts")),
      check("database.types", fileExists("types/database.types.ts")),
      check("script:lint", !!pkg.scripts?.lint),
      check("script:test", !!pkg.scripts?.test),
    ];
    return { pass: items.every((i) => i.pass), items };
  },

  phase1: () => {
    const logs = rgCount("console\\.log");
    const items = [check("no_console_log", logs === 0, logs ? `${logs} matches` : "")];
    return { pass: items.every((i) => i.pass), items };
  },

  phase2: () => {
    const doc = rgCount("document\\.|querySelector|getElementById");
    const classList = rg("classList\\.");
    const classListOnlyClickPost =
      !classList ||
      (classList.split("\n").every((line) => line.includes("useClickPost")));
    const mountedWatch = rgCount(
      "onMounted\\(\\s*\\(\\s*\\)\\s*=>\\s*\\{\\s*watchEffect"
    );
    const items = [
      check("no_imperative_dom", doc === 0, doc ? `${doc} matches` : ""),
      check("classList_allowlist", classListOnlyClickPost, classList || "none"),
      check("no_onMounted_watchEffect", mountedWatch === 0),
    ];
    return { pass: items.every((i) => i.pass), items };
  },

  phase2e: () => {
    const count = rgCount("transition-all", ["*.vue", "*.js"]);
    const items = [check("no_transition_all", count === 0, count ? `${count} matches` : "")];
    return { pass: items.every((i) => i.pass), items };
  },

  phase3a: () => {
    const tsconfig = fs.readFileSync(path.join(root, "tsconfig.json"), "utf8");
    const items = [
      check(
        "noUncheckedIndexedAccess",
        tsconfig.includes("noUncheckedIndexedAccess")
      ),
    ];
    return { pass: items.every((i) => i.pass), items };
  },

  phase3c: () => {
    const storeJs = fs.readdirSync(path.join(root, "stores")).filter((f) => f.endsWith(".js"));
    const storeTs = fs.readdirSync(path.join(root, "stores")).filter((f) => f.endsWith(".ts"));
    const items = [
      check("no_store_js", storeJs.length === 0, storeJs.join(", ") || "ok"),
      check("stores_ts", storeTs.length >= 4, `${storeTs.length} .ts files`),
    ];
    return { pass: items.every((i) => i.pass), items };
  },

  phase3d: () => {
    const composableJs = fs
      .readdirSync(path.join(root, "composables"))
      .filter((f) => f.endsWith(".js") && !f.startsWith("."));
    const keys = fileExists("composables/keys.ts");
    const stringInject = rgCount("inject\\(['\"]", ["composables/*.ts", "composables/*.js"]);
    const items = [
      check("composables_ts", composableJs.length === 0, composableJs.join(", ") || "ok"),
      check("keys_ts", keys),
      check("no_string_inject_composables", stringInject === 0),
    ];
    return { pass: items.every((i) => i.pass), items };
  },

  phase3e: () => {
    const avatar = fs.readFileSync(
      path.join(root, "components/UI/Avatar.vue"),
      "utf8"
    );
    const follow = fs.readFileSync(
      path.join(root, "components/UI/Button/Follow.vue"),
      "utf8"
    );
    const items = [
      check("avatar_lang_ts", avatar.includes('lang="ts"')),
      check("follow_lang_ts", follow.includes('lang="ts"')),
    ];
    return { pass: items.every((i) => i.pass), items };
  },

  phase4: () => {
    const postStorePath = path.join(root, "stores/post.ts");
    const problems = [];
    if (fs.existsSync(postStorePath)) {
      const content = fs.readFileSync(postStorePath, "utf8");
      if (/userProfile|userAvatars/.test(content)) {
        problems.push("userProfile/userAvatars state");
      }
      if (
        /async fetchUserProfile\s*\(|async fetchProfiles\s*\(|setProfile\s*\(/.test(
          content,
        )
      ) {
        problems.push("profile fetch actions");
      }
      if (/\.from\(\s*["']profiles["']\)/.test(content)) {
        problems.push("profiles table query");
      }
    }
    const hits = problems.join("; ");
    const items = [check("post_store_no_userProfile", !hits, hits || "ok")];
    return { pass: items.every((i) => i.pass), items };
  },

  phase5: () => {
    const tanstack = rgCount("useQuery|useMutation|useInfiniteQuery", [
      "queries/hooks/**/*.ts",
    ]);
    const wired = rgCount(
      "useFeedQuery|useCurrentProfileQuery|useMyEngagementQuery|useLikeMutation|useBookmarkMutation|useFollowMutation",
      ["pages/**/*.vue", "composables/**/*.ts", "components/**/*.vue"],
    );
    const queries = tanstack + wired;
    const piniaFrom = rgCount("\\.from\\(", ["stores/**/*.ts", "stores/**/*.js"]);
    const items = [
      check("vue_query_in_features", queries > 0, `${queries} usages`),
      check("no_supabase_in_pinia", piniaFrom === 0, piniaFrom ? `${piniaFrom} .from()` : ""),
    ];
    return { pass: items.every((i) => i.pass), items };
  },

  phase6: () => {
    const client = rgCount("posts_with_meta", ["*.vue", "*.ts", "*.js"]);
    const items = [check("client_uses_view", client > 0, `${client} refs`)];
    return { pass: items.every((i) => i.pass), items };
  },

  phase7: () => {
    const alert = fs.existsSync(path.join(root, "composables/useAlert.js"))
      ? fs.readFileSync(path.join(root, "composables/useAlert.js"), "utf8")
      : fs.readFileSync(path.join(root, "composables/useAlert.ts"), "utf8");
    const discriminated =
      alert.includes("kind:") ||
      alert.includes("'idle'") ||
      alert.includes('"idle"');
    const items = [check("useAlert_discriminated", discriminated)];
    return { pass: items.every((i) => i.pass), items };
  },

  phase8: () => {
    const hits = rgCount("noForward|stopHere");
    const items = [check("no_click_class_gates", hits === 0, hits ? `${hits} matches` : "")];
    return { pass: items.every((i) => i.pass), items };
  },

  phase9: () => {
    const test = run("npm test");
    const e2eHappy = fileExists("e2e/happy-path.spec.ts");
    const items = [
      check("npm_test", test.ok, test.error || ""),
      check("e2e_happy_path", e2eHappy),
    ];
    return { pass: items.every((i) => i.pass), items };
  },

  phase10: () => {
    const ci = fileExists(".github/workflows/curriculum.yml");
    const items = [check("github_actions_curriculum", ci)];
    return { pass: items.every((i) => i.pass), items };
  },
};

const config = JSON.parse(
  fs.readFileSync(path.join(root, "curriculum.config.json"), "utf8")
);

const results = {};
for (const phase of config.phases) {
  for (const v of phase.verify) {
    if (!checks[v]) continue;
    if (!results[v]) results[v] = checks[v]();
  }
}

const typecheck = run("npm run typecheck");
results.typecheck = {
  pass: typecheck.ok,
  items: [check("npm_run_typecheck", typecheck.ok, typecheck.error || "")],
};

let exit = 0;
const lines = [];

for (const phase of config.phases) {
  const phaseResults = phase.verify.map((v) => results[v]).filter(Boolean);
  const pass =
    phaseResults.length > 0 && phaseResults.every((r) => r.pass);
  if (phaseFilter && phase.id !== phaseFilter) continue;
  if (!pass && !phase.optional) exit = 1;
  const failed = phaseResults.flatMap((r) =>
    (r.items || []).filter((i) => !i.pass).map((i) => ({ check: i.id, detail: String(i.detail || "").slice(0, 120) }))
  );
  lines.push({
    id: phase.id,
    title: phase.title,
    optional: !!phase.optional,
    pass,
    prompt: phase.prompt,
    failed,
  });
}

if (jsonOut) {
  const payload = JSON.stringify(
    { root, typecheck: results.typecheck, phases: lines },
    null,
    2
  );
  process.stdout.write(payload + "\n");
  process.exit(exit);
}

console.error("Curriculum verification\n");
for (const p of lines) {
  const icon = p.pass ? "PASS" : p.optional ? "SKIP?" : "FAIL";
  console.error(`[${icon}] Phase ${p.id}: ${p.title}`);
  for (const item of p.failed ?? []) {
    const mark = "  ✗";
    const detail = item.detail ? ` — ${String(item.detail).slice(0, 200)}` : "";
    console.error(`${mark} ${item.check}${detail}`);
  }
  if (p.pass) {
    console.error("  ✓ all checks passed");
  }
}
console.error(
  `\nTypecheck: ${results.typecheck.pass ? "PASS" : "FAIL"}${
    results.typecheck.items?.[0]?.detail
      ? ` — ${String(results.typecheck.items[0].detail).slice(0, 200)}`
      : ""
  }`
);
process.exit(exit);
