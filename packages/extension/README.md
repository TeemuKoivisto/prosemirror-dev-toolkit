# prosemirror-dev-toolkit Chrome extension

https://chrome.google.com/webstore/detail/prosemirror-developer-too/gkgbmhfgcpfnogoeclbaiencdjkefonj

Chrome API https://developer.chrome.com/docs/extensions/reference/

## How to run

1. `pnpm i`
2. Build the toolkit: `pnpm --filter prosemirror-dev-toolkit build`
3. Build/watch the extension: `pnpm --filter extension build` or `extension dev`
4. Go to `chrome://extensions`
5. Click "Load unpacked" https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/
6. Go to this repository's `packages/extension/dist` folder and select it
7. Extension should be loaded! Click the refresh icon to reload the extension after changes
