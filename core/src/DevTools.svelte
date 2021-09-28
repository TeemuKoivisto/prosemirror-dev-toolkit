<script lang="ts">
  import { onMount } from 'svelte'
  import type { EditorView } from 'prosemirror-view'
  import { setContext } from '$context'

  import FloatingBtn from './FloatingBtn.svelte'
  import FloatingDock from './FloatingDock.svelte'

  import type { ButtonPosition } from './types'

  export let view: EditorView,
    devToolsExpanded = false,
    buttonPosition: ButtonPosition = 'bottom-right'

  setContext('editor-view', {
    view,
  })

  onMount(() => {
    const html = document && document.querySelector('html')
    if (devToolsExpanded && html) {
      html.style.marginBottom = '341px'
    }
  })

  function handleFloatingBtnClick() {
    devToolsExpanded = true
    const html = document && document.querySelector('html')
    if (html) {
      html.style.marginBottom = '341px'
    }
  }
  function handleFloatingDockClose() {
    devToolsExpanded = false
    const html = document && document.querySelector('html')
    if (html) {
      html.style.marginBottom = null
    }
  }
</script>

<section>
  {#if devToolsExpanded}
    <FloatingDock onClose={handleFloatingDockClose} />
  {:else}
    <FloatingBtn on:click={handleFloatingBtnClick} {buttonPosition} />
  {/if}
</section>

<style lang="scss">
  * {
    --font-sans: Helvetica Neue, Calibri Light, Roboto, sans-serif;
    --font-small: 11px;
    --font-medium: 13px;
    --font-large: 16px;
    --height-tabs-menu: 48px;
    --color-black: #222;
    --color-blue-bg: #363755;
    --color-blue-light: #85d9ef;
    /* --color-green-text: #b8e248; */
    --color-gray-light: #d3d3d9;
    --color-green: green; // diff inserted
    --color-green-light: #87cc86; // diff deleted color
    --color-purple-dark: rgb(80, 68, 93); // list darker bg
    --color-purple: rgb(96, 76, 104); // borders in eg lists
    --color-purple-light: rgb(99, 99, 123); // list text color
    --color-red: #d66363; // diff deleted
    --color-red-gray: rgb(187, 145, 163); // h2 color
    --color-red-light: rgb(255, 162, 177);
    --color-yellow: #eaea37; // diff updated
    --color-white: #fff;
  }
  :root {
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
  }
  section {
    font-family: var(--font-sans);
    font-size: var(--font-medium);
  }
</style>
