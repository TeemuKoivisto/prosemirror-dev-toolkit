<style lang="scss">
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
    /* font-size: var(--json-tree-font-size, 12px); */
    /* font-family: var(--json-tree-font-family, 'Courier New', Courier, monospace); */
  }
  ul :global(li) {
    line-height: var(--li-line-height);
    display: flex;
    list-style: none;
  }
  /* ul :global(ul) { */
  ul {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0.3em 0;
  }
  li {
    align-items: baseline;
    display: flex;
    list-style: none;
  }
  .empty-block {
    width: 0.875em;
  }
  .node-key {
    color: rgb(133, 217, 239);
    cursor: pointer;
    margin-right: 0.5em;
  }
  .node-value {
    color: rgb(184, 226, 72);
    margin-right: 0.5em;
    &[data-type='number'] {
      color: rgb(253, 153, 60);
    }
    &[data-type='null'] {
      color: rgb(250, 62, 126);
    }
    &.expanded {
      color: rgb(209, 146, 155);
    }
  }
  .arrow-btn {
    background: transparent;
    border: 0;
    color: rgb(133, 217, 239);
    cursor: pointer;
    margin-right: 0.5em;
    padding: 0;
    transition: all 150ms ease 0s;
    transform: rotateZ(0deg);
    transform-origin: 45% 50%;
    position: relative;
    line-height: 1.1em;
    font-size: 0.75em;
    &.collapsed {
      transform: rotateZ(90deg);
    }
  }
  .log-copy-button {
    background: transparent;
    border: 0;
    color: rgb(133, 217, 239);
    cursor: pointer;
    margin: 0;
    padding: 0.1em 0.5em;
    &:hover {
      background: rgba(255, 162, 177, 0.4);
      border-radius: 2px;
      color: white;
    }
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { APP_CONTEXT } from './tree-utils.ts'

  export let id

  const { treeMapStore, props, getNode, toggleCollapse, formatValue } = getContext(APP_CONTEXT)

  let node = getNode(id)
  treeMapStore.subscribe(value => {
    const n = value.get(id)
    if (node !== n) {
      node = n
    }
  })
  $: collapsed = node.collapsed

  function handleLogNode() {
    console.log(node)
    window._node = node
  }
  function handleCopyNodeToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(node.value))
  }
</script>

<li>
  {#if node.children.length > 0}
    <button
      class={`arrow-btn ${collapsed ? 'collapsed' : ''}`}
      on:click={() => toggleCollapse(node.id)}
    >
      ▶
    </button>
  {:else}
    <div class="empty-block" />
  {/if}
  <div class="node-key" on:click={() => toggleCollapse(node.id)}>{node.key}:</div>
  <div
    class="node-value"
    data-type={node.type}
    class:expanded={!collapsed && node.children.length > 0}
  >
    {formatValue(node.value)}
  </div>
  {#if props.showLogButton}
    <button class="log-copy-button" on:click={handleLogNode}>log</button>
  {/if}
  {#if props.showCopyButton}
    <button class="log-copy-button" on:click={handleCopyNodeToClipboard}>copy</button>
  {/if}
</li>
{#if !collapsed}
  <ul style={`padding-left: ${node.depth * 4}px`}>
    {#each node.children as child}
      <svelte:self id={child.id} />
    {/each}
  </ul>
{/if}
