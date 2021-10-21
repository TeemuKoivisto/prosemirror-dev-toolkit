# [prosemirror-dev-toolkit](https://github.com/TeemuKoivisto/prosemirror-dev-toolkit) [![version](https://img.shields.io/npm/v/prosemirror-dev-toolkit?style=flat-square)](https://www.npmjs.com/package/prosemirror-dev-toolkit) [![package minified size](https://img.shields.io/bundlephobia/min/prosemirror-dev-toolkit?style=flat-square&color=important)](https://bundlephobia.com/result?p=prosemirror-dev-toolkit) [![package size](https://img.shields.io/bundlephobia/minzip/prosemirror-dev-toolkit?style=flat-square)](https://bundlephobia.com/result?p=prosemirror-dev-toolkit)

This is a rewrite of [prosemirror-dev-tools](https://github.com/d4rkr00t/prosemirror-dev-tools) which I'm a big fan of, yet have felt it could use some improvements. Since the old version didn't seem that actively maintained and also because I wanted to remove the hard dependency to React, use TypeScript and make the whole thing smaller, I took it to my own hands to rewrite it in Svelte.

Unlike React, Svelte compiles directly to JS without having to bundle in a runtime which should make the library smaller to use in projects that don't use React. I also pruned some of the extra dependencies by using just vanilla Svelte features and made the thing injectable as stand-alone script.

## [Demo](https://teemukoivisto.github.io/prosemirror-dev-toolkit/)

```sh
npm i prosemirror-dev-toolkit
```

And use it eg:

```ts
import { applyDevTools } from 'prosemirror-dev-toolkit'
// Or
import applyDevTools from 'prosemirror-dev-toolkit'

...

  function createEditorView(element: HTMLDivElement, state: EditorState) {
    const view = new EditorView({ mount: element }, {
      state,
      dispatchTransaction,
    })
    applyDevTools(view)
    return view
  }
```

I use some hacky JS tricks to gain access to both EditorState and DOMSerializer that previously required bundling both prosemirror-state and prosemirror-model. Another issue I had with the old dev tools was its quite heavy node_modules (200 MBs). These plus the need for customizing the tools was why I wanted to redo it.

# Features

As in the old tools, the toolkit consists of 6 tabs which interact with the PM editor in various ways. Basically what happens is the dev-toolkit injects itself into the DOM, visible as the rounded button in the bottom right corner. It also replaces the dispatchTransaction method of the EditorView to be able to track the transactions as they occur.

Another useful thing it can do is persist snapshots and hydrate them, to which I also added export/import functionality, that makes replaying editor bugs easier. They don't work with Yjs however as it blocks any updates to state that are not triggered through Yjs. I might add that some day. Also in the old dev-tools there was a node picker to inspect PM nodes but I'm not sure is it working properly and alas, haven't gotten around remaking it.

## State

Shows the current toJSON'd state.doc as well as the selection, augmented by a few additional properties, active marks and a simple summary of the document. These tree views were implemented in the original with react-json-tree library which although ported to Svelte (svelte-json-tree) felt a little complex and difficult to customize. Instead, I wrote a simple recursive component and then rolled it out as a separate Svelte library: https://github.com/TeemuKoivisto/svelte-tree-view

## History

History tab shows the last dispatched transaction with a diff of the changed content, diff of the changed selection, toDOM'd document slice between the selection start and end and the actual transaction at the bottom.

Copying the old diffing logic was perhaps the most annoying feature to implement as it required me to wrap my head around the jsondiffpatch's delta format and figure out how to rewrite them as Svelte components. Somewhat interesting topic, certainly, but quite tedious. I changed the original colors to a perhaps more distinct palette and added the transaction to the history entry as well. I've found it quite useful.

I added some new features to the trees such as 'log' and 'copy' buttons which logs the node to window (eg into `_node` variable) or add it to your clipboard.

You can hydrate a state from a transaction by double-clicking it. This, however, fails with Yjs so be advised. I have thought of adding import/export of transaction history to allow replaying them but haven't had time for it.

## Plugins

Shows the current plugins and their states. This is mostly the same as in the old tools but I added some convenience buttons to for example log the plugin to a `_plugin` object that you can manipulate from the console. Handy for inspecting the plugin editor props which are not visible from the plugin state.

As a side-note, I'm sure I have not covered all possible object types beyond the common Objects/Arrays/Maps/Sets. Make an issue or PR if something's weird.

## Schema

Shows the current schema's nodes and marks. Same as in the old tools but I added circular node detection to make the recursion a little lighter. Not strictly needed as all the nodes are uncollapsed and can't be auto-expanded but hey, it's there.

## Structure

A bit more complicated tab it shows the document in a neat block view with a side panel to inspect the node contents. Auto-expanding the content was a bit too catastrophic with large trees so I removed that, as it was in the old tools. Thought about allowing selecting and deleting nodes directly from the DocView.

## Snapshots

Shows the stored snapshots (toJSON'd topNode eg "doc") in localStorage. The changed I've made are switching to date strings instead of unix timestamps for default names. Then, you can double-click the snapshot to edits its name. Show replaces the current doc with the snapshot doc, allowing you to revert it with Hide. Restore does a one-way replacement of the doc with the snapshot. Export toJSON's and downloads the snapshot. You have to now double-click Delete to delete to prevent occasional misclicks. There's also a new "Import snapshot" button to replace state from JSON snapshot.

## Other things

I have tried bundling the library as minified UMD module that can be injected from a CDN. It works in most cases but since it's a bit experimental still, it's not part of the build yet. Uses quite contrived hacks to gain access to the EditorView from the `pmViewDesc` property in a live PM editor instance. Could be used to turn this into a Chrome extension.

## How to run locally

1. `yarn`
2. `yarn start`

Should open a React app at http://localhost:3000/prosemirror-dev-toolkit/

## Commands

