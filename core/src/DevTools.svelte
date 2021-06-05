<script lang="ts">
  import { EditorView } from 'prosemirror-view'

  import FloatingBtn from './FloatingBtn.svelte'
  import FloatingDock from './FloatingDock.svelte'

  import { createContext } from './context.ts'

  export let view: EditorView
  let devToolsExpanded = true

  createContext(view)

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

{#if devToolsExpanded}
  <FloatingDock onClose={handleFloatingDockClose} />
{:else}
  <FloatingBtn onClick={handleFloatingBtnClick} />
{/if}
