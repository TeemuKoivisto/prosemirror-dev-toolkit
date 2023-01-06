# [prosemirror-dev-toolkit](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit) [![version](https://img.shields.io/npm/v/prosemirror-dev-toolkit?style=flat-square)](https://www.npmjs.com/package/prosemirror-dev-toolkit) [![package minified size](https://img.shields.io/bundlephobia/min/prosemirror-dev-toolkit?style=flat-square&color=important)](https://bundlephobia.com/result?p=prosemirror-dev-toolkit) [![package size](https://img.shields.io/bundlephobia/minzip/prosemirror-dev-toolkit?style=flat-square)](https://bundlephobia.com/result?p=prosemirror-dev-toolkit)

This is a rewrite of [prosemirror-dev-tools](https://github.com/d4rkr00t/prosemirror-dev-tools) which I'm a big fan of, yet have felt could use some improvements. Since it didn't seem that actively maintained anymore and also because I wanted to remove the hard dependency to React, use TypeScript and make the whole thing smaller, I took it to my own hands to rewrite it in Svelte.

Unlike React, Svelte compiles directly to JS without having to bundle a runtime which should make the library smaller to use in projects that don't use React. I also pruned some of the extra dependencies by using out-of-the-box Svelte features and have experimented making the library injectable as a [stand-alone script](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/blob/master/inject.js).

## [Also as a Chrome extension 🚀](https://chrome.google.com/webstore/detail/prosemirror-developer-too/gkgbmhfgcpfnogoeclbaiencdjkefonj)

This is a big improvement as you no longer have to bundle `prosemirror-dev-toolkit` with your dependencies (and filter it out for production build). Also, it allows you to inspect _any_ live editor. It is basically the `inject.js` script packaged into its own extension.

## [Demo](https://teemukoivisto.github.io/prosemirror-dev-toolkit/)

```sh
npm i prosemirror-dev-toolkit
```

And use it eg:

```ts
import { applyDevTools } from 'prosemirror-dev-toolkit'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from 'prosemirror-schema-basic'
import { exampleSetup } from 'prosemirror-example-setup'

const view = new EditorView(document.querySelector('#editor') as HTMLElement, {
  state: EditorState.create({
    doc: schema.nodes.doc.createAndFill(),
    plugins: exampleSetup({ schema })
  })
})
applyDevTools(view)
```

### [Code sandbox](https://codesandbox.io/s/summer-cookies-v4ck6)

# API

```ts
type ButtonPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
interface DevToolsOpts {
  devToolsExpanded?: boolean
  buttonPosition?: ButtonPosition
}
declare function applyDevTools(view: EditorView, opts?: DevToolsOpts): void
declare function removeDevTools(): void
declare global {
  interface Window {
    applyDevTools: typeof applyDevTools
    editorView?: EditorView
    _node?: { node: PMNode; pos: number }
    _doc?: {
      [key: string]: any
    }
    _trs?: Transaction[]
    _plugin?: [Plugin | undefined, unknown]
  }
}
export { applyDevTools, removeDevTools, ButtonPosition, DevToolsOpts }
```

I am adding properties to the global Window interface which may or may not that convenient. From my perspective I don't have to ts-ignore those assignments but if you use those properties in your repos you'll have to obey the types or receive rather weird errors (that may take a moment to figure out).

# Features

As was in the old tools, prosemirror-dev-toolkit consists of 6 tabs which interact with the PM editor in various ways. Basically what happens is dev-toolkit injects itself into the DOM, visible as the rounded button in the bottom right corner, and then sets the dispatchTransaction prop of the EditorView to be able to track transactions.

In addition it can persist snapshots and hydrate them which I enhanced by adding export/import from JSON as well as ensuring the functionality doesn't break with Yjs. In the old dev-tools there was a node picker to inspect PM nodes that I have not had time to remake.

For quick live editor instance debugging I have added a script to inject the dev-toolkit directly from CDN: [inject.js](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/blob/master/inject.js) Not 100% bulletproof but works in most cases. Improvements welcome. Might use it to turn this into a Chrome extension.

## State

![State tab](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/blob/master/packages/prosemirror-dev-toolkit/cypress/integration/__image_snapshots__/%23%20State%20tab%20%20Should%20allow%20expanding%20and%20collapsing%20and%20tree-view%20nodes%20%230.png?raw=true)

Shows the current toJSON'd state.doc as well as the selection, augmented by a few additional properties, active marks and a simple summary of the document. These tree views were implemented in the original with react-json-tree library which although ported to Svelte (svelte-json-tree) felt a little complex and difficult to customize. Instead, I wrote a simple recursive component and then rolled it out as a separate Svelte library: https://github.com/TeemuKoivisto/svelte-tree-view

## History

![History tab](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/blob/d1620e6007d14068c58f704cd1a0d7e6b393f428/core/cypress/integration/__image_snapshots__/%23%20History%20tab%20%20Should%20track%20transactions%20and%20show%20diffs%20%230.png?raw=true)

History tab shows the last dispatched transaction with a diff of the changed content, diff of the changed selection, toDOM'd document slice between the selection start and end and the actual transactions at the bottom. Rather than just showing the originating transaction, I am also displaying all the appended transactions as well.

Copying the old diffing logic was perhaps the most annoying feature to implement as it required me to wrap my head around the jsondiffpatch's delta format and figure out how to rewrite it in Svelte. Somewhat interesting topic, certainly, but quite tedious. I changed the original colors to a perhaps more distinct palette and added the transaction to the history entry as well. I've found it quite useful.

I added some new features to the trees such as 'log' and 'copy' buttons which log the node to window (eg into `_node` variable) or add it to your clipboard.

You can hydrate the doc from a transaction by double-clicking it. I have thought of adding import/export of transaction history to allow replaying them but haven't had time for it.

## Plugins

![Plugins tab](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/blob/master/packages/prosemirror-dev-toolkit/cypress/integration/__image_snapshots__/%23%20Plugins%20tab%20%20Should%20show%20the%20default%20plugins%20and%20allow%20inspecting%20them%20%230.png?raw=true)

Shows the current plugins and their states. This is mostly the same as in the old tools but I added some convenience buttons to for example log the plugin to a `_plugin` object that you can manipulate from the console. Handy for inspecting the plugin editor props which are not visible from the plugin state.

As a side-note, I'm sure I have not covered all possible object types in `svelte-tree-view` beyond the common Objects/Arrays/Maps/Sets. Make an issue or PR if something's weird.

## Schema

![Schema tab](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/blob/master/packages/prosemirror-dev-toolkit/cypress/integration/__image_snapshots__/%23%20Schema%20tab%20%20Should%20show%20the%20current%20schema%20nodes%20and%20marks%20%230.png?raw=true)

Shows the current schema's nodes and marks. Same as in the old tools but I added circular node detection to make the recursion a little lighter. Not strictly needed as all the nodes are uncollapsed and can't be auto-expanded but hey, it's there.

## Structure

![Structure tab](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/blob/master/packages/prosemirror-dev-toolkit/cypress/integration/__image_snapshots__/%23%20Structure%20tab%20%20Should%20show%20the%20DocView%20of%20the%20current%20and%20doc%20and%20Node%20info%20%230.png?raw=true)

A bit more complicated tab it shows the document in a neat block view with a side panel to inspect the node contents. Auto-expands the content whenever it's within reasonable size (less than 50 children). You can double click nodes to scroll into them. Thought about allowing selecting and deleting nodes directly from the DocView.

## Snapshots

![Snapshots tab](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/blob/d1620e6007d14068c58f704cd1a0d7e6b393f428/core/cypress/integration/__image_snapshots__/%23%20Snapshots%20tab%20%20Should%20show%20snapshots%20and%20allow%20interacting%20with%20them%20%230.png?raw=true)

Shows the stored snapshots (toJSON'd topNode eg "doc") in localStorage. The changes I've made are switching to date strings instead of unix timestamps for default names. Then, you can double-click the snapshot to edit its name. 'Show' button replaces the current doc with the snapshot doc, allowing you to revert it with 'Hide'. 'Restore' does a one-way replacement of the doc with the snapshot. And well I say one-way but since I don't erase the actual PM history you can Ctrl-z your way out of it.

'Export' toJSONs and downloads the snapshot. You have to now double-click 'Delete' to prevent occasional misclicks. There's also a new 'Import snapshot' button above the main panel to replace the doc with exported snapshot.

## How to run locally

You need `pnpm` installed globally.

1. `pnpm`
2. `pnpm start`

Should open a React app at http://localhost:3300

## Tests

To run the end-to-end tests you must launch the site (`pnpm site`) and then run `pnpm --filter prosemirror-dev-tolkit test:e2e`. NOTE: the snapshots might locally fail. They should work in CI however and hopefully they'll be fixed when I next time migrate Cypress and its libraries.

## Contributing

Contributions and issues are more than welcome! This project uses changesets https://github.com/changesets/changesets to generate changelogs but in short, when you commit from terminal the changeset prompt is opened in which you should write your functionality using conventional commits https://www.conventionalcommits.org/en/v1.0.0/ to create a changeset (which is for something that changes the library for the downstream users).
