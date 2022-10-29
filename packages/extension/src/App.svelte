<script lang="ts">
  import * as chrome from './chrome'

  let proseMirrorFound = false

  async function handleClick() {
    const sending = await chrome.sendMessage({ type: 'badge', data: {} })
  }
</script>

<div>
  <h1>
    {#if proseMirrorFound}
      ProseMirror detected
    {:else}
      No ProseMirror found
    {/if}
  </h1>
  <button on:click={handleClick}>msg</button>
</div>

<style lang="scss">
  div {
    display: flex;
    overflow: hidden;
    flex: 1 1 0;
    flex-direction: column;
  }

  ul {
    overflow: auto;
    flex-grow: 1;
    padding-top: 0.583rem; /* 8px */
  }

  .root div {
    margin-top: 40%;
    text-align: center;
  }
</style>
