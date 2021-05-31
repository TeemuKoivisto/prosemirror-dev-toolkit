<style lang="scss">
  .wrapper {
    border-left: 1px solid #606178;
    border-right: 1px solid #606178;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    &.root {
      border: 0;
      padding: 0;
    }
  }
  .container {
    background: #363755;
    color: black;
    display: flex;
    font-size: 13px;
    margin-top: 3px;
  }
  .number-box {
    padding: 3px 6px;
    background: rgba(255, 255, 255, 0.3);
  }
  button {
    background: transparent;
    border: 0;
    color: #272624;
    cursor: pointer;
    display: flex;
    height: 100%;
    padding: 3px 9px;
    white-space: pre;
    width: 100%;
    &:hover {
      background: rgba(255, 162, 177, 0.4);
      color: white;
    }
    &.selected {
      background: rgba(255, 162, 177, 0.4);
    }
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'

  const { selected, colors, handleNodeClick } = getContext('doc-view')

  export let node, startPos, isRoot

  $: color = colors[node.type.name]
</script>

<div class="wrapper" class:root={isRoot}>
  <div class="container" style={`background: ${color}`}>
    <div class="number-box">{startPos}</div>
    <button class:selected={false} on:click={() => handleNodeClick(node)}>{node.type.name}</button>
    <div class="number-box">{startPos + node.nodeSize}</div>
  </div>
  {#if node.content.size !== 0}
    {#each node.content.content as child, i}
      <svelte:self node={child} startPos={startPos + i + 1} />
    {/each}
  {/if}
</div>
