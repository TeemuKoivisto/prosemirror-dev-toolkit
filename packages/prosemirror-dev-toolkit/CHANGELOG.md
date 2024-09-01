# prosemirror-dev-toolkit

## 1.1.8

### Patch Changes

- d7f1d88: fix: infinite loop in selection html with base64 images

## 1.1.7

### Patch Changes

- e0b293a: chore: update deps

## 1.1.6

### Patch Changes

- cb08e82: refactor: update input handler, use single event-dispatcher in HistoryList

## 1.1.5

### Patch Changes

- ce24336: fix: dont crash if toolkit web-component already registered
- ce24336: refactor: auto-restore pasted snapshots for convenience's sake

## 1.1.4

### Patch Changes

- c8be8b7: docs: update README broken screenshot links

## 1.1.3

### Patch Changes

- 2cd2d91: chore: update deps
- 2cd2d91: ui: increase button font-sizes, h2 margins

## 1.1.2

### Patch Changes

- 9e01617: feat: add pmCmd to window to make life easier

## 1.1.1

### Patch Changes

- 0f629e4: fix: wonky centering of DocNode button text

## 1.1.0

### Minor Changes

- 55a651c: feat: use web component to encapsulate styles

## 1.0.7

### Patch Changes

- 60b4483: feat: show appended trs in history tab
- 42e2871: feat: animate history entries, make deleted diff text more readable
- 989590d: fix: update svelte-tree-view to fix silly install script #40

## 1.0.6

### Patch Changes

- 3972cdf: fix: rename container CSS class as it might clash
- 0fbd67e: fix: don't run applyDevTools on destroyed views

## 1.0.5

### Patch Changes

- 96b1137: fix: edge case where view.props is undefined

## 1.0.4

### Patch Changes

- 09f2fe9: fix missing bundle from build, remove btn class, refactor site from CRA to Vite

## 1.0.3

### Patch Changes

- 9583d49: docs: update README, other docs

## 1.0.2 (2022-09-06)

### What's Changed

- style: move eslint & prettify to root, run them on all files by @TeemuKoivisto in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/19
- feat: add Copy, Paste button & Paste snapshot modal by @TeemuKoivisto in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/20
- fix: close button css by @TeemuKoivisto in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/21

**Full Changelog**: https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v1.0.1...v1.0.2

## 1.0.1 (2022-07-15)

### What's Changed

- fix: check for empty array incase transactions were filtered & restore unit tests by @TeemuKoivisto in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/18

**Full Changelog**: https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v1.0.0...v1.0.1

## 1.0.0 (2022-07-04)

As it appears there aren't any fatal bugs remaining, publishing the first "complete" version seems appropriate. This also includes upgrading all dependencies which shouldn't make any breaking changes.

### What's Changed

- Update dependencies by @TeemuKoivisto in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/17

**Full Changelog**: https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.11...v1.0.0

## 0.0.11 (2022-04-22)

### What's Changed

- Fix double apply by @TeemuKoivisto in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/16

**Full Changelog**: https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.10...v0.0.11

## 0.0.10 (2022-04-20)

### What's Changed

- chore: migrate node-sass to dart-sass by @ocavue in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/14
- fix: include extension to the import by @ocavue in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/13

**Full Changelog**: https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.9...v0.0.10

## 0.0.9 (2022-04-15)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.8...v0.0.9

### Bug fixes

- Bundle jsondiffpatch and remove chalk by @ocavue in https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/12

## 0.0.8 (2022-02-06)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.7...v0.0.8

### Style fixes

Fix html margin-bottom not working in FireFox to provide space for the dock. Changed to padding-bottom.

## 0.0.7 (2022-02-06)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.6...v0.0.7

### Features

#### Structure tab

Update selected node properly over transactions. Scroll into node on double click.
Remove height: 100% from HistoryList button.

## 0.0.6 (2021-11-18)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.5...v0.0.6

### Style fixes

Remove height: 100% from HistoryList button.

## 0.0.5 (2021-11-18)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.4...v0.0.5

### Bug fixes

Add try-catch when accessing localStorage. Crashes in sandbox otherwise.

## 0.0.4 (2021-11-18)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.3...v0.0.4

### Bug fixes

Import tree-view's behavior. Docs

## 0.0.3 (2021-11-15)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.2...v0.0.3

### Bug fixes

Fix use .cjs for "main" import. Docs

## 0.0.2 (2021-11-12)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/compare/v0.0.1...v0.0.2

### Bug fixes

Fix CI and NPM publish

## 0.0.1 (2021-11-12)

https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/commit/6c6b4b788790315b25d33cacd8b9c6bb81bb6515

### Initial release
