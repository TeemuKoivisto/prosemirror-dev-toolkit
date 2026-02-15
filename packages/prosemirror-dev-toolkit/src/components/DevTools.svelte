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

<style lang="scss">
  .dev-tools {
    font-family: var(--font-sans);
    font-size: var(--font-medium);
    font-weight: 400;

    --font-sans: Helvetica Neue, Calibri Light, Roboto, sans-serif;
    --font-small: 11px;
    --font-medium: 13px;
    --font-large: 16px;
    --height-tabs-menu: 48px;

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
