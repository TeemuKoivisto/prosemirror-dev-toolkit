<script lang="ts">
  import { EditorView } from 'prosemirror-view'

  import FloatingBtn from './FloatingBtn.svelte'
  import FloatingDock from './FloatingDock.svelte'

  export let view: EditorView | null = null
  let devToolsExpanded = false

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
