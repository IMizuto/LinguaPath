# Repository Guidelines

## Project Structure & Module Organization

LinguaPath is a static language-learning PWA built with HTML, CSS, and vanilla JavaScript. The root `index.html` is the home page, `auth.js` handles sign-in and sync, and `sw.js` and `manifest.json` define offline caching and installation.

- `ielts/` and `hsk/` contain skill modules with their own `index.html` entry points. Keep lesson data and media with the module that uses them, such as `ielts/reading/data/` and `ielts/vocab/media/`.
- `tedtalks/` contains TED practice. `assets/` contains shared UI, themes, workers, and `s4-core.wasm`. `rust-core/` contains the Rust audio and search core and the JavaScript WASM builder and self-tests.

## Build, Test, and Development Commands

Run these commands from the repository root. The frontend has no install or bundle step.

- `node server.js` serves the site at `http://127.0.0.1:8899`. Add `--lan` to test from another device on the local network.
- `node --check assets/s4-ui.js` checks JavaScript syntax. Substitute each standalone script you changed.
- `node rust-core/build-wasm.js` regenerates `assets/s4-core.wasm` and runs its audio and fuzzy-search assertions.

## Coding Style & Naming Conventions

Match surrounding indentation and quoting. Shared JavaScript and CSS generally use two spaces. Use `camelCase` for JavaScript identifiers, `s4-*.js` for shared scripts, and existing lesson-data patterns such as `writing_data.js` and `reading_u_1.js`. Reuse `S4UI` for shared controls and preserve relative paths from nested pages. No repository-wide lint or formatting tool is configured.

## Testing Guidelines

The WASM self-tests use Node’s built-in `assert`. There is no general test suite, test-file naming convention, or coverage threshold. Open the changed module through the local server and exercise its main workflow. Check navigation from the home page, the browser console, and playback when media changes. Review the core asset list and cache version in `sw.js` when changing offline assets, then verify reload and offline behavior.

## Commit & Pull Request Guidelines

Use a short, action-oriented subject. Recent history mixes plain subjects with prefixes such as `fix(speaking):`, `perf:`, and `refactor:`. In the pull request, summarize the affected modules, list verification steps, link related issues when available, and attach screenshots for visible changes.
