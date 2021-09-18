# [prosemirror-dev-toolkit](https://teemukoivisto.github.io/prosemirror-dev-toolkit/) [![version](https://img.shields.io/npm/v/prosemirror-dev-toolkit?style=flat-square)](https://www.npmjs.com/package/prosemirror-dev-toolkit)

This is a rewrite of [prosemirror-dev-tools](https://github.com/d4rkr00t/prosemirror-dev-tools) which I'm a big fan of, yet have felt it could use some improvements. Since the repo didn't seem that actively maintained and also because I wanted to remove the hard dependency to React, use TypeScript and make the whole thing smaller, I took it to my own hands to rewrite it in Svelte.

Svelte benefits mostly be being much closer to developing webcomponents as the bundled components do not require a runtime and only come with the minimal boilerplate to make them function. TypeScript was my other reason, which I think helps with the overall maintainability of the library.

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

Current size: x kBs

With the dependencies: x kBs

I reduced the dependencies to 4, of which I can still remove the `prosemirror-model` by cleverly extracting DOMSerializer from the EditorView. Also the old dev-tools comes with quite heavy node_modules (200 MBs) which was the other reason I wanted to make the library smaller. Last but not least I wanted to add new features and fix whatever current bugs or warnings there are now.

# Features

The toolkit consists of 6 tabs which interact with the PM editor in various ways. Basically what happens is the dev-toolkit injects itself into the DOM, visible as the rounded button in the bottom right corner. It also replaces the dispatchTransaction method of the EditorView to be able to track the transactions as they occur.

Dev toolkit is also able to persist snapshots of the EditorState to the localStorage but these do not work as such with Yjs as it prevents updating the state if not done through Yjs. In the old dev tools there was also a node picker to inspect PM nodes but I have not gotten around implementing it yet.

## State

Shows the current toJSON'd state.doc as well as the selection, augmented by a few additional properties, active marks and a simple summary of the document. These tree views were implemented in the original with react-json-tree library which although ported to Svelte (svelte-json-tree) felt unreasonably complex and difficult to customize. Instead, I wrote a simple recursive component and then rolled it out as a separate Svelte library: https://github.com/TeemuKoivisto/svelte-tree-view

While rendering very large trees is still slow, as it was with the react-json-tree, I think overall the library is a lot simpler and _Svelter_ than the original and hopefully someone might benefit from it too. Also it was a nice learning experience.

## History

History tab shows the last dispatched transaction with a diff of the changed content, diff of the changed selection, toDOM'd document slice between the selection start and end and the actual transaction at the bottom.

Copying the old diffing logic was perhaps the most annoying feature to implement as it required me to wrap my head around the jsondiffpatch's delta format and figure out how they are represented as a single Svelte component. Somewhat interesting topic, certainly, but tedious to work with. I changed the original colors to a perhaps more distinct palette and added the tree-view of the transaction as well. I've noticed that's actually very hand in many cases when you are curious what meta tags/whatever has changed.

Having my own custom tree-view library I could also add neat enhancements such as adding the logged nodes to the window, thus enabling you to modify the values as you please. Clicking 'LOG' in the transaction header makes it available in your browser console as `_tr` variable. Clicking 'EXPAND' auto uncollapses the whole tree, making it easier to ogle through.

In the old dev-tools hydrating from a transaction appears bugged but I fixed it here. I had the intention of adding import/exporting transaction histories alongside the snapshots to be able to replay weird things from say production editor in your local editor but I haven't gotten around that.

## Plugins

Shows the current plugins and their states as well as an option to either log or copy them. This is mostly the same to the old logic yet I added a similar copy feature that adds the plugin to `_plugin` object that you can mess around with in the console. Could be handy to inspect the plugin editor props which are not visible from the plugin state itself.

As a side-note, I'm sure I have not covered all possible object types beyond the common Objects/Arrays/Maps/Sets. If you find something quirky I'd appreciate you let me know.

## Schema

Shows the current schema with the nodes and marks. Very similar to the original. I did add, however, prevention of recursing all the node properties which at the time was necessary as my tree-view did wastefully iterate the whole object beyond what was collapsed in the view. Now I think it might be unnecessary but since those are circular nodes that I removed I think it's not needed. You can log them yourself and inspect from the console if required.

## Structure

The structure tab was another little bit more complicated functionality to build. Having written my tree-view I found it easy to translate the way I implemented my recursive TreeNodes into DocNodes that basically do the same thing but are grouped by their owner block node. Fiddling with the margins might had been the most annoying part as you had to make sure they stay correct when the child nodes wrap. Luckily the original version had most of this covered so I did skip a few headaches by following their approach.

On the side, there is a tree-view of the selected node. However, I had to collapse the doc node by default since it would be a too big of a performance penalty when triggering transactions on a very large tree. It happens with the old dev-tools too but I haven't had the time nor the patience to dwell into how to make it go fast. Virtualizing, maybe. Or just preventing recursing the new tree _which is hard_ because you have to basically make an equality check for every node or somehow know the diff between the new and old node to update it smoothly.

Now I that think of it, maybe doing deepEquality check first and then deciding what to update could be the way to go. Most be dozen times faster than just rendering everything again. Hah.

## Snapshots

Shows the stored snapshots in localStorage. I added a small enhancement of being able to edit the snapshot name afterwards which I thought was sorely missed. Also the whole item doesn't highlight when you hover it, just the buttons which are clickable.

## Other things

I think that's about it. There are some new features that I have planned but since coding takes time and I have only limited amount of it, I probably prioritize other things as well. In general I think Svelte runs smoother although I can't say I know it for certain. Bundling the whole library without ReactDOM runtime is, however, a big plus in my books which should make at least your dev bundles a lot smaller if you are not using React otherwise.

Aand another interesting thing that I have experimented with is injecting the dev-toolkit into production PM editors in the wild. Basically what you do is extract the EditorView from the `pmViewDesc` of the editor element, fetch the minified dev-toolkit.js and then apply it to watch the magic happen! But there are some caveats here and there that I should figure out before turning this into a Chrome extension.

## How to run locally

1. `yarn`
2. `yarn start`

Should open a React app at http://localhost:3000/prosemirror-dev-toolkit/

## Commands

