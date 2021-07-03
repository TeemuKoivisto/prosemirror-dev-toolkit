<style lang="scss">
  .wrapper {
    border-left: 1px solid #363755;
    border-right: 1px solid #363755;
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
  .inline-children {
    border-left: 1px solid #606178;
    border-right: 1px solid #606178;
    display: flex;
    flex-wrap: wrap;
    padding: 0 12px;
    & > :global(div) {
      flex-grow: 1;
      padding: 0;
    }
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'

  const { selected, colors, handleNodeClick } = getContext('doc-view')

  export let node,
    startPos,
    isRoot = false

  $: color = colors[node.type.name]
  $: name =
    node.isText && node.marks.length > 0
      ? `${node.type.name} - [${node.marks.map(m => m.type.name).join(', ')}]`
      : node.type.name
  $: startPositions = Array(node.childCount)
    .fill(undefined)
    .reduce((acc, _, idx) => {
      if (idx === 0) {
        return [isRoot ? 0 : startPos + 1]
      }
      let prev = acc[idx - 1]
      let cur = node.child(idx - 1)
      return [...acc, prev + cur.nodeSize]
    }, [])
  $: endPos = startPos + node.nodeSize
  $: inlineChildren = node.content.content.every(n => n.isInline)
</script>

<div class={`${$$props.class || ''} wrapper`} class:root={isRoot}>
  <div class="container" style={`background: ${color}`}>
    <div class="number-box">{startPos}</div>
    <button class:selected={false} on:click={() => handleNodeClick(node)}>{name}</button>
    <div class="number-box">{endPos}</div>
  </div>
  <div class:inline-children={inlineChildren}>
    {#if node.content.size !== 0}
      {#each node.content.content as child, i}
        <svelte:self node={child} startPos={startPositions[i]} />
      {/each}
    {/if}
  </div>
</div>
