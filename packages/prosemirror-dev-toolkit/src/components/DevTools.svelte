<script lang="ts">
  import { onMount } from 'svelte'
  import type { EditorView } from 'prosemirror-view'
  import type { EditorState, Transaction } from 'prosemirror-state'
  import { setContext } from '$context'

  import FloatingBtn from './FloatingBtn.svelte'
  import FloatingDock from './FloatingDock.svelte'

  import type { ButtonPosition } from '../types'

  interface Props {
    view: EditorView
    devToolsExpanded?: boolean
    buttonPosition?: ButtonPosition
  }

  let { view, devToolsExpanded = false, buttonPosition = 'bottom-right' }: Props = $props()

  setContext('editor-view', {
    view,
    execCmd(cmd: (state: EditorState, dispatch?: (tr: Transaction) => void) => void) {
      cmd(view.state, view.dispatch)
    },
    replaceEditorContent(state: EditorState) {
      const tr = view.state.tr
      tr.replaceWith(0, view.state.doc.nodeSize - 2, state.doc.content)
      view.dispatch(tr)
    }
  })

  onMount(() => {
    const html = document && document.querySelector('html')
    if (devToolsExpanded && html) {
      html.style.paddingBottom = '341px'
    }
  })

  function handleFloatingBtnClick() {
    devToolsExpanded = true
    const html = document && document.querySelector('html')
    if (html) {
      html.style.paddingBottom = '341px'
    }
  }
  function handleFloatingDockClose() {
    devToolsExpanded = false
    const html = document && document.querySelector('html')
    if (html) {
      html.style.paddingBottom = ''
    }
  }
</script>

<section class="dev-tools">
  {#if devToolsExpanded}
    <FloatingDock onClose={handleFloatingDockClose} />
  {:else}
    <FloatingBtn onclick={handleFloatingBtnClick} {buttonPosition} />
  {/if}
</section>

<style>
  .dev-tools {
    font-family: var(--font-sans);
    font-size: var(--font-medium);
    font-weight: 400;

    --font-sans: Helvetica Neue, Calibri Light, Roboto, sans-serif;
    --font-small: 11px;
    --font-medium: 13px;
    --font-large: 16px;
    --height-tabs-menu: 48px;

    --color-black: #222;
    --color-blue-bg: #363755;
    --color-blue-light: #85d9ef;
    /* --color-green-text: #b8e248; */
    --color-dim-text: #727288; /* used for empty plugin titles */
    --color-gray-light: #d3d3d9;
    --color-green: green; /* diff inserted */
    --color-green-light: #87cc86; /* diff deleted color */
    --color-purple-dark: rgb(80, 68, 93); /* list darker bg */
    --color-purple: rgb(96, 76, 104); /* borders in eg lists */
    --color-purple-light: rgb(99, 99, 123); /* list text color */
    --color-red: #d66363; /* diff deleted */
    --color-red-gray: rgb(187, 145, 163); /* h2 color */
    --color-red-light: rgb(255, 162, 177);
    --color-yellow: #eaea37; /* diff updated */
    --color-white: #fff;

    --color-black-rgb: 34, 34, 34;
    --color-red-light-rgb: 255, 162, 177;
    --color-white-rgb: 255, 255, 255;

    --tree-view-font-family: 'Helvetica Neue', 'Calibri Light', Roboto, sans-serif;
    --tree-view-font-size: 13px;
    --tree-view-left-indent: 0.875em;
    --tree-view-line-height: 1.1;
    --tree-view-key-margin-right: 0.5em;

    --tree-view-base00: #363755;
    --tree-view-base01: #604d49;
    --tree-view-base02: #6d5a55;
    --tree-view-base03: #d1929b;
    --tree-view-base04: #b79f8d;
    --tree-view-base05: #f9f8f2;
    --tree-view-base06: #f7f4f1;
    --tree-view-base07: #faf8f5;
    --tree-view-base08: #fa3e7e;
    --tree-view-base09: #fd993c;
    --tree-view-base0A: #f6bf81;
    --tree-view-base0B: #b8e248;
    --tree-view-base0C: #b4efe4;
    --tree-view-base0D: #85d9ef;
    --tree-view-base0E: #be87ff;
    --tree-view-base0F: #d6724c;

    :global(.svelte-tree-view *) {
      box-sizing: border-box;
    }

    :global(.hidden) {
      opacity: 0;
      visibility: hidden;
    }
  }
</style>
