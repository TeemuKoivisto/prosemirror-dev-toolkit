<script lang="ts">
  import { getContext } from '$context'

  import SplitView from '$tabs/SplitView.svelte'
  import Button from '$components/Button.svelte'

  const { view } = getContext('editor-view')

  function handleClick() {}
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <div class="top-row">
      <h2>Current doc</h2>
      <Button class="hidden">log</Button>
    </div>
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row">
      <h2>Node info</h2>
      <Button on:click={handleClick}>log</Button>
    </div>
    <div>things</div>
  </div>
</SplitView>

<style lang="scss">
  .right-panel[slot='right'] {
    padding: 0;
  }
</style>
