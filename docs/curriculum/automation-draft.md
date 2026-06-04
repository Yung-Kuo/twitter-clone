# Cursor Automation draft (optional)

Use this if you want the curriculum to run on a schedule without pasting prompts.

## Trigger

- **Cron:** Weekdays 8pm — `0 20 * * 1-5` (adjust in Automations UI)

## Tools

- Open or update PRs (`gitPr`)

## Instructions (paste into Automation)

When this runs on repo `twitter-clone`:

1. Run `npm run curriculum:next` and read the printed phase prompt file.
2. Follow `docs/curriculum/AGENT_CONTRACT.md` and `.cursor/rules/curriculum-auto-build.mdc`.
3. Implement exactly one phase per run.
4. Run `npm run curriculum:verify`, `npm run build`, `npm run typecheck` if needed.
5. Update `REFACTOR_STATUS.md`.
6. Open a PR titled `refactor(phase<id>): <title>` with verify output in the description.

UI must not change. If verify still fails for the same phase after the run, stop and report blockers in the PR body.

## Finish in editor

- Repo + branch for `gitConfig`
- Cloud agent settings if required

Create via Cursor Automations UI or the automate skill in Agent mode.
