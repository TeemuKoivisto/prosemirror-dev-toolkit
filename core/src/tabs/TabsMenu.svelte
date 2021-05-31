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
    color: white;
    cursor: pointer;
    height: 100%;
    padding: 1em;
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    &.active {
      border-bottom: 2px solid #ffa2b1;
    }
  }
</style>

<script lang="ts">
  export let active, onClickTab
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
  <li><button on:click={() => onClickTab('close')}>X</button></li>
</ul>
