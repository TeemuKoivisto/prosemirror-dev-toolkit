<style>
  .added {
    display: inline-block;
    background: lightyellow;
    color: green;
    padding: 1px 3px 2px 0;
    text-indent: 0;
    min-height: 1ex;
  }
  .deleted {
    display: inline-block;
    background: lightyellow;
    color: pink;
    padding: 1px 3px 2px 0;
    text-decoration: line-through;
    text-indent: 0;
    min-height: 1ex;
  }
</style>

<script lang="ts">
  export let value, defaultFormatter

  function replaceSpacesWithNonBreakingSpace(value: string) {
    return value.replace(/\s/gm, ' ')
  }
  function parseTextDiff(textDiff: string[]) {
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

{#if Array.isArray(value)}
  <!-- The why https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md -->
  {#if value.length === 1}
    <span class="added">{getValueString(value[0])}</span>
  {:else if value.length === 2}
    <span class="updated">
      <span class="deleted">{getValueString(value[0])}</span> =&gt;
      <span class="added">{getValueString(value[1])}</span>
    </span>
  {:else if value.length === 3 && value[1] === 0 && value[2] === 0}
    <span class="deleted">{getValueString(value[0])}</span>
  {:else if value.length === 3 && value[2] === 2}
    <span class="updated">
      {#each parseTextDiff(value[0]) as item}
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
  {defaultFormatter(value)}
{/if}
