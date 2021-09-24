<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import type { EditorView } from 'prosemirror-view'

  import FloatingBtn from './FloatingBtn.svelte'
  import FloatingDock from './FloatingDock.svelte'

  import type { ButtonPosition } from './types'

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

<style lang="scss">
  section {
    font-family: var(--font-sans);
    font-size: var(--font-medium);
  }
</style>
