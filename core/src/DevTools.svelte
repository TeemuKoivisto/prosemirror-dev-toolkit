<style lang="scss">
  :global(:root) {
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

  section {
    font-family: var(--font-sans);
    font-size: var(--font-medium);
  }
</style>

<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import type { EditorView } from 'prosemirror-view'

  import FloatingBtn from './FloatingBtn.svelte'
  import FloatingDock from './FloatingDock.svelte'

  import type { ButtonPosition } from './types.ts'

  export let view: EditorView,
    devToolsExpanded = false,
    buttonPosition: ButtonPosition = 'bottom-right'

  setContext('editor-view', {
    view
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
