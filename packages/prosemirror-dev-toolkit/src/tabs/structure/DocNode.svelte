<script lang="ts">
  import { getContext } from '$context'
  import type { Node as PMNode } from 'prosemirror-model'
  import type { Fragment } from '$typings/pm'

  const { colors, handleNodeClick } = getContext('doc-view')

  export let node: PMNode, startPos: number, depth: number

  const isRoot = depth === 0
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
    handleNodeClick(node, startPos)
  }
  function handleNameDblClick() {
    handleNodeClick(node, startPos, true)
  }
</script>

<li class={`${$$props.class || ''} doc-node`} class:root={isRoot}>
  <div class="doc-node-body" style={`background: ${color}`}>
    <div class="number-box">{startPos}</div>
    <div class="node-name">
      <button
        class:selected={false}
        aria-label="Show node info button"
        on:click={handleNameClick}
        on:dblclick={handleNameDblClick}>{name}</button
      >
    </div>
    <div class="number-box">{endPos}</div>
  </div>
  <ul class:inline-children={inlineChildren} class:show-borders={depth >= 1}>
    {#each fragment.content as child, i}
      <svelte:self node={child} startPos={startPositions[i]} depth={depth + 1} />
    {/each}
  </ul>
</li>

<style>
  .doc-node {
    border-left: 1px solid var(--color-blue-bg);
    border-right: 1px solid var(--color-blue-bg);
    display: flex;
    flex-direction: column;
    padding: 0 12px;
  }
  .doc-node.root {
    border: 0;
    padding: 0;
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
    background: rgba(var(--color-white-rgb), 0.3);
  }
  .node-name {
    width: 100%;
  }
  button {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--color-black);
    cursor: pointer;
    display: flex;
    height: 100%;
    white-space: pre;
    width: 100%;
  }
  button:hover {
    background: rgba(var(--color-red-light-rgb), 0.4);
    color: var(--color-white);
  }
  button.selected {
    background: rgba(var(--color-red-light-rgb), 0.4);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul.show-borders {
    border-left: 1px solid var(--color-purple);
    border-right: 1px solid var(--color-purple);
  }
  .inline-children {
    border-left: 1px solid var(--color-purple);
    border-right: 1px solid var(--color-purple);
    display: flex;
    flex-wrap: wrap;
    padding: 0 12px;
  }
  /* TODO this hurts my soul */
  .inline-children > :global(.doc-node) {
    flex-grow: 1;
    padding: 0;
  }
</style>
