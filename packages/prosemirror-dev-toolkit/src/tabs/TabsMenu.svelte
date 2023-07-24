<script lang="ts">
  export let active: string, onClickTab: (tab: string) => void
</script>

<ul class="tabs-menu">
  <li>
    <button class:active={active === 'state'} on:click={() => onClickTab('state')}>STATE</button>
  </li>
  <li>
    <button class:active={active === 'history'} on:click={() => onClickTab('history')}
      >HISTORY</button
    >
  </li>
  <li>
    <button class:active={active === 'plugins'} on:click={() => onClickTab('plugins')}
      >PLUGINS</button
    >
  </li>
  <li>
    <button class:active={active === 'schema'} on:click={() => onClickTab('schema')}>SCHEMA</button>
  </li>
  <li>
    <button class:active={active === 'structure'} on:click={() => onClickTab('structure')}
      >STRUCTURE</button
    >
  </li>
  <li>
    <button class:active={active === 'snapshots'} on:click={() => onClickTab('snapshots')}
      >SNAPSHOTS</button
    >
  </li>
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
    height: 100%;
    font-size: var(--font-medium);
    font-weight: 400;
    padding: 1em;
    &:hover {
      background: rgba($color-white, 0.05);
    }
    &.active {
      border-bottom: 2px solid $color-red-light;
    }
  }
</style>
