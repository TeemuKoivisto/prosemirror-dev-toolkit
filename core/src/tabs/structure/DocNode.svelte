<script lang="ts">
  import { getContext } from '$context'
  import type { Node as PMNode } from 'prosemirror-model'
  import type { Fragment } from '$typings/pm'

  const { selected, colors, handleNodeClick } = getContext('doc-view')

  export let node: PMNode,
    startPos: number,
    isRoot = false

  $: fragment = node.content as Fragment
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
  $: inlineChildren = fragment.content.every(n => n.isInline)

  function handleNameClick() {
    handleNodeClick(node)
  }
</script>

<li class={`${$$props.class || ''} doc-node`} class:root={isRoot}>
  <div class="doc-node-body" style={`background: ${color}`}>
    <div class="number-box">{startPos}</div>
    <button class:selected={false} aria-label="Show node info button" on:click={handleNameClick}
      >{name}</button
    >
    <div class="number-box">{endPos}</div>
  </div>
  <ul class:inline-children={inlineChildren}>
    {#each fragment.content as child, i}
      <svelte:self node={child} startPos={startPositions[i]} />
    {/each}
  </ul>
</li>

<style lang="scss">
  .doc-node {
    border-left: 1px solid var(--color-blue-bg);
    border-right: 1px solid var(--color-blue-bg);
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    &.root {
      border: 0;
      padding: 0;
    }
  }
  .doc-node-body {
    background: var(--color-blue-bg);
    color: var(--color-black);
    display: flex;
    font-size: 13px;
    margin-top: 3px;
  }
  .number-box {
    padding: 3px 6px;
    background: rgba($color-white, 0.3);
  }
  button {
    background: transparent;
    border: 0;
    color: var(--color-black);
    cursor: pointer;
    display: flex;
    height: 100%;
    padding: 3px 9px;
    white-space: pre;
    width: 100%;
    &:hover {
      background: rgba($color-red-light, 0.4);
      color: var(--color-white);
    }
    &.selected {
      background: rgba($color-red-light, 0.4);
    }
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .inline-children {
    border-left: 1px solid var(--color-purple);
    border-right: 1px solid var(--color-purple);
    display: flex;
    flex-wrap: wrap;
    padding: 0 12px;
    /* TODO this hurts my soul */
    & > :global(.doc-node) {
      flex-grow: 1;
      padding: 0;
    }
  }
</style>
