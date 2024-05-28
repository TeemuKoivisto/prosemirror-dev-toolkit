<script lang="ts">
  export let tabs: readonly string[], active: string, onClickTab: (tab: string) => void
</script>

<ul class="tabs-menu">
  {#each tabs as tab}
    <li>
      <button class:active={active === tab} on:click={() => onClickTab(tab)}>{tab}</button>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    overflow-x: scroll;
    padding: 0;
  }
  button {
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;
    color: $color-white;
    cursor: pointer;
    font-size: var(--font-medium);
    font-weight: 400;
    height: 100%;
    padding: 1em;
    text-transform: uppercase;
    &:hover {
      background: rgba($color-white, 0.05);
    }
    &.active {
      border-bottom: 2px solid $color-red-light;
    }
  }
</style>
