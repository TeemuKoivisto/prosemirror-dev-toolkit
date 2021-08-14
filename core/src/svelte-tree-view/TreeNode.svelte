<style lang="scss">
  ul {
    display: flex;
    flex-direction: column;
    height: max-content;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  li {
    align-items: baseline;
    display: flex;
    height: max-content;
    line-height: var(--li-line-height);
    list-style: none;
    width: 100%;
    /* &.collapsed {
      margin-bottom: 0.3em;
    } */
  }
  li + li {
    margin-top: 0.25em;
  }
  .empty-block {
    visibility: hidden;
  }
  .node-key {
    color: rgb(133, 217, 239);
    margin-right: 0.5em;
    &.has-children {
      cursor: pointer;
    }
    &.p-left {
      padding-left: 1.1em;
    }
  }
  .node-value {
    color: rgb(184, 226, 72);
    margin-right: 0.5em;
    word-break: break-all;
    &[data-type='number'] {
      color: rgb(253, 153, 60);
    }
    &[data-type='null'],
    &[data-type='undefined'] {
      color: rgb(250, 62, 126);
    }
    &.expanded {
      color: rgb(209, 146, 155);
    }
    &.has-children {
      cursor: pointer;
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
  .buttons {
    display: flex;
    flex-wrap: wrap;
  }
  .log-copy-button {
    background: transparent;
    border: 0;
    color: rgb(133, 217, 239);
    cursor: pointer;
    margin: 0;
    padding: 0 0.5em;
    &:hover {
      background: rgba($color-red-light, 0.4);
      border-radius: 2px;
      color: white;
    }
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'

  export let id: string

  const {
    treeMapStore,
    propsStore,
    rootElementStore,
    getNode,
    toggleCollapse,
    expandAllNodesToNode,
    formatValue
  } = getContext('app')
  $: node = getNode(id)
  treeMapStore.subscribe(value => {
    const n = value.get(id)
    if (node !== n) {
      node = n
    }
  })
  $: hasChildren = node.children.length > 0
  $: valueComponent = $propsStore.valueComponent

  function handleLogNode() {
    console.info('%c [prosemirror-dev-toolkit]: Property added to window._node', 'color: #b8e248')
    console.log(node.value)
    window._node = node.value
  }
  function handleCopyNodeToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(node.value))
  }
  function handleToggleCollapse() {
    if (hasChildren) {
      toggleCollapse(node.id)
    } else if (node.circularOfId) {
      expandAllNodesToNode(node.circularOfId)
      $rootElementStore.querySelector(`li[data-tree-id="${node.circularOfId}"]`)?.scrollIntoView()
    }
  }
</script>

<li class="row" class:collapsed={node.collapsed && hasChildren} data-tree-id={node.id}>
  {#if hasChildren}
    <button
      class={`arrow-btn ${node.collapsed ? 'collapsed' : ''}`}
      on:click={handleToggleCollapse}
    >
      ▶
    </button>
  {/if}
  <div
    class="node-key"
    class:has-children={hasChildren}
    class:p-left={!hasChildren}
    on:click={handleToggleCollapse}
  >
    {node.key}:
  </div>
  <div
    class="node-value"
    data-type={node.type}
    class:expanded={!node.collapsed && hasChildren}
    class:has-children={hasChildren}
    on:click={handleToggleCollapse}
  >
    {#if valueComponent}
      <svelte:component
        this={valueComponent}
        value={node.value}
        {node}
        defaultFormatter={val => formatValue(val, node)}
      />
    {:else}
      {formatValue(node.value, node)}
    {/if}
  </div>
  <div class="buttons">
    {#if $propsStore.showLogButton}
      <button class="log-copy-button" on:click={handleLogNode}>log</button>
    {/if}
    {#if $propsStore.showCopyButton}
      <button class="log-copy-button" on:click={handleCopyNodeToClipboard}>copy</button>
    {/if}
  </div>
</li>
{#if !node.collapsed && hasChildren}
  <li class="row">
    <ul style={`padding-left: 0.875em`}>
      {#each node.children as child}
        <svelte:self id={child.id} />
      {/each}
    </ul>
  </li>
{/if}
