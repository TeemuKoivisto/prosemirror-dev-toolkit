<style>
  ul {
    --string-color: var(--json-tree-string-color, #cb3f41);
    --symbol-color: var(--json-tree-symbol-color, #cb3f41);
    --boolean-color: var(--json-tree-boolean-color, #112aa7);
    --function-color: var(--json-tree-function-color, #112aa7);
    --number-color: var(--json-tree-number-color, #3029cf);
    --label-color: var(--json-tree-label-color, #871d8f);
    --arrow-color: var(--json-tree-arrow-color, #727272);
    --null-color: var(--json-tree-null-color, #8d8d8d);
    --undefined-color: var(--json-tree-undefined-color, #8d8d8d);
    --date-color: var(--json-tree-date-color, #8d8d8d);
    --li-identation: var(--json-tree-li-indentation, 1em);
    --li-line-height: var(--json-tree-li-line-height, 1.3);
    --li-colon-space: 0.3em;
    font-size: var(--json-tree-font-size, 12px);
    font-family: var(--json-tree-font-family, 'Courier New', Courier, monospace);
  }
  ul :global(li) {
    line-height: var(--li-line-height);
    display: flex;
    list-style: none;
  }
  ul,
  ul :global(ul) {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: flex;
    list-style: none;
  }
  .node-key {
    color: rgb(133, 217, 239);
    margin-right: 1em;
  }
  .node-value {
    color: rgb(184, 226, 72);
  }
  button {
    background: transparent;
    border: 0;
    color: rgb(133, 217, 239);
    cursor: pointer;
    margin-right: 0.5em;
    padding: 0;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { APP_CONTEXT } from './tree-utils.ts'

  export let key

  const { treeMapStore, getNode, toggleCollapse, formatValue } = getContext(APP_CONTEXT)
  let node = getNode(key)
  treeMapStore.subscribe(value => {
    const n = value.get(key)
    if (node !== n) {
      node = n
    }
  })
  $: collapsed = node.collapsed
</script>

<li>
  {#if node.children.length > 0}
    <button on:click={() => toggleCollapse(node.id)}>▼</button>
  {/if}
  <div class="node-key">{node.key}:</div>
  <div class="node-value">{formatValue(node.value)}</div>
</li>
{#if !collapsed}
  <ul style={`padding-left: ${node.depth * 4}px`}>
    {#each node.children as child}
      <svelte:self key={child.id} />
    {/each}
  </ul>
{/if}
