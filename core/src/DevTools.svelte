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
  }
  function handleFloatingDockClose() {
    devToolsExpanded = false
  }
</script>

{#if devToolsExpanded}
  <FloatingDock onClose={handleFloatingDockClose} />
{:else}
  <FloatingBtn onClick={handleFloatingBtnClick} />
{/if}
