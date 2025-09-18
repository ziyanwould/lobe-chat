# Repository Guidelines

## Project Structure & Module Organization

- Monorepo with `pnpm` packages. Key dirs: `apps/` (apps), `packages/` (shared libs), `src/` (core sources), `docs/` (documentation), `.cursor/rules/` (engineering rules).
- Follow patterns in existing code when adding modules. Co-locate related tests and stories with their components when practical.

## Build, Test, and Development Commands

- Install deps: `pnpm i`
- Type check: `bun run type-check`
- Run tests (web): `bunx vitest run --silent='passed-only' '[file-path-pattern]'`
- Run tests (package): `cd packages/<name> && bunx vitest run --silent='passed-only' '[file-path-pattern]'`
- Notes: wrap file paths in single quotes; never run `bun run test`. Use `bun` for scripts and `bunx` for CLIs. Start/build apps from their directory via `bun run dev` / `bun run build` when available.

## Coding Style & Naming Conventions

- TypeScript: strict typing; prefer `interface` for object shapes; use generics for reusable APIs.
- React: functional components with hooks; use Ant Design, `@lobehub/ui`, and `antd-style` per patterns.
- State/Data: Zustand + SWR; Drizzle ORM with plural `snake_case` tables and explicit FKs.
- Follow existing ESLint/Prettier settings; keep changes small and focused.

## Testing Guidelines

- Frameworks: Vitest + Testing Library. Always add tests for new code.
- Scope: start with unit tests close to changed code; expand as needed.
- Naming: prefer `*.test.ts` / `*.test.tsx`.
- If a test fails twice, stop and ask for help.

## Internationalization

- Add keys in `src/locales/default/namespace.ts` using nested objects.
- Provide at least `zh-CN` translations for preview. Do not run `pnpm i18n` manually (CI handles it).

## Commit & Pull Request Guidelines

- Branches: `username/feat/feature-name`.
- Commits: prefix with a gitmoji (e.g., `:sparkles:`), clear intent.
- Pull: prefer rebase (`git pull --rebase`).
- PRs: use `.github/PULL_REQUEST_TEMPLATE.md`; include summary, linked issues, screenshots/notes, and testing steps.

## Additional Tips

- Error handling and accessibility are required; log meaningfully.
- Keep secrets out of VCS; use environment files per app/package.

## Recent Changes / Worklog

- Image generation: added SiliconCloud provider integration.
  - New: `packages/model-runtime/src/providers/siliconcloud/createImage.ts` (OpenAI-compatible `/images/generations`, proxy/base URL, robust error mapping).
  - Hooked in: `packages/model-runtime/src/providers/siliconcloud/index.ts`.
  - Models: `packages/model-bank/src/aiModels/siliconcloud.ts` includes `Qwen/Qwen-Image`, `Qwen/Qwen-Image-Edit`, `Kwai-Kolors/Kolors`.
  - Env: `.env.example` adds `SILICONCLOUD_API_KEY`, `SILICONCLOUD_PROXY_URL`, `SILICONCLOUD_BASE_URL`.
- Image provider UX: prioritize SiliconCloud in selector (no global provider reordering).
  - Change: `src/store/aiInfra/slices/aiProvider/selectors.ts` returns SiliconCloud first in `enabledImageModelList`.
- Defaults updated for image generation.
  - Default provider/model: `SiliconCloud` / `Qwen/Qwen-Image` in `src/store/image/slices/generationConfig/initialState.ts`.
  - Tests synced: `src/store/image/slices/generationConfig/selectors.test.ts`.
- Reverted an earlier attempt to reorder the global provider list to avoid broad UI impact.

Verification

- Type check: `bun run type-check`
- Targeted tests: `bunx vitest run --silent='passed-only' 'src/store/image/slices/generationConfig/selectors.test.ts'`
- Manual: open Image page, confirm SiliconCloud appears first and defaults apply.
