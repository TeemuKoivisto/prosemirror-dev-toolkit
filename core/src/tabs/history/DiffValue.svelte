<script lang="ts">
  import type { TreeNode } from 'svelte-tree-view'

  export let value: any, node: TreeNode, defaultFormatter: (val: any) => string

  $: nodeVal = node.value

  function replaceSpacesWithNonBreakingSpace(value: string) {
    return value.replace(/\s/gm, ' ')
  }
  function parseTextDiff(textDiff: string) {
    const diffByLines = textDiff.split(/\n/gm).slice(1)
    return diffByLines.map(line => {
      const type = line.startsWith('-') ? 'delete' : line.startsWith('+') ? 'add' : 'raw'

      return { [type]: replaceSpacesWithNonBreakingSpace(line.substr(1)) }
    })
  }
  function stringifyAndShrink(v: any) {
    if (v === null) {
      return 'null'
    }
    const str = JSON.stringify(v)
    if (typeof str === 'undefined') {
      return 'undefined'
    }
    return str.length > 22 ? `${str.substr(0, 15)}…${str.substr(-5)}` : str
  }

  function getValueString(raw: any) {
    if (typeof raw === 'string') {
      return raw
    }
    return stringifyAndShrink(raw)
  }
</script>

{#if Array.isArray(nodeVal)}
  <!-- The why https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md -->
  {#if nodeVal.length === 1}
    <span class="added">{getValueString(nodeVal[0])}</span>
  {:else if nodeVal.length === 2}
    <span class="updated">
      <span class="deleted">{getValueString(nodeVal[0])}</span>
      <span class="arrow"> =&gt;</span>
      <span class="added">{getValueString(nodeVal[1])}</span>
    </span>
  {:else if nodeVal.length === 3 && nodeVal[1] === 0 && nodeVal[2] === 0}
    <span class="deleted">{getValueString(nodeVal[0])}</span>
  {:else if nodeVal.length === 3 && nodeVal[2] === 2}
    <span class="updated">
      {#each parseTextDiff(nodeVal[0]) as item}
        {#if item.delete}
          <span class="deleted">{item.delete}</span>
        {:else if item.add}
          <span class="added">{item.add}</span>
        {:else}
          <span>{item.raw}</span>
        {/if}
      {/each}
    </span>
  {/if}
{:else}
  {defaultFormatter(nodeVal)}
{/if}

<style>
  .added {
    display: inline-block;
    background: var(--color-green-light);
    border-radius: 1px;
    color: var(--color-green);
    padding: 1px 2px;
    text-indent: 0;
    min-height: 1ex;
  }
  .deleted {
    display: inline-block;
    background: var(--color-red);
    border-radius: 1px;
    color: var(--color-gray-light);
    padding: 1px 2px;
    text-decoration: line-through;
    text-indent: 0;
    min-height: 1ex;
  }
  .updated {
    word-break: break-all;
  }
  .updated .added {
    background: var(--color-yellow);
  }
  .arrow {
    color: var(--color-green-light);
  }
</style>
