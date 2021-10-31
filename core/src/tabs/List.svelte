<script lang="ts">
  export let listItems: { key: string; value: string; empty?: boolean }[] = [],
    selectedKey: string | undefined,
    onSelect: (item: { key: string; value: string }) => void
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

<style lang="scss">
  ul {
    color: $color-white;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  li + li {
    border-top: 1px solid $color-purple;
  }
  button {
    background: transparent;
    border: 0;
    color: $color-gray-light;
    cursor: pointer;
    display: flex;
    font-family: monospace;
    font-size: var(--font-small);
    font-weight: 100;
    height: 100%;
    padding: 6px 18px;
    text-transform: uppercase;
    width: 100%;
    &:hover {
      background: rgba($color-red-light, 0.4);
      color: $color-white;
      &.empty {
        background: $color-purple-dark;
      }
    }
    &.selected {
      background: rgba($color-red-light, 0.4);
      &.empty {
        background: $color-purple-dark;
      }
    }
    &.empty {
      color: $color-dim-text;
    }
  }
</style>
