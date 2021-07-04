<style lang="scss">
  ul {
    color: var(--color-white);
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  li + li {
    border-top: 1px solid var(--color-purple);
  }
  button {
    background: transparent;
    border: 0;
    color: var(--color-gray-light);
    cursor: pointer;
    display: flex;
    font-family: monospace;
    font-size: var(--font-small);
    height: 100%;
    padding: 6px 18px;
    text-transform: uppercase;
    width: 100%;
    &:hover {
      background: rgba($color-red-light, 0.4);
      color: var(--color-white);
    }
    &.selected {
      background: rgba($color-red-light, 0.4);
      &.empty {
        background: var(--color-purple);
      }
    }
    &.empty {
      background: transparent;
      color: var(--color-purple);
      &:hover {
        background: var(--color-purple);
      }
    }
  }
</style>

<script lang="ts">
  export let listItems = [],
    selectedKey,
    onSelect
</script>

<ul>
  {#each listItems as item}
    <li>
      <button
        class:selected={selectedKey === item.key}
        class:empty={item.empty}
        on:click={() => onSelect(item)}>{item.value}</button
      >
    </li>
  {/each}
</ul>
