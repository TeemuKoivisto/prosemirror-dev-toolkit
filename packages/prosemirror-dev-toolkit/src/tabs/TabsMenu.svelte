<script lang="ts">
  interface Props {
    active: string
    onClickTab: (tab: string) => void
  }
  const { active, onClickTab }: Props = $props()
</script>

<ul class="tabs-menu">
  <li>
    <button class:active={active === 'state'} onclick={() => onClickTab('state')}>STATE</button>
  </li>
  <li>
    <button class:active={active === 'history'} onclick={() => onClickTab('history')}
      >HISTORY</button
    >
  </li>
  <li>
    <button class:active={active === 'plugins'} onclick={() => onClickTab('plugins')}
      >PLUGINS</button
    >
  </li>
  <li>
    <button class:active={active === 'schema'} onclick={() => onClickTab('schema')}>SCHEMA</button>
  </li>
  <li>
    <button class:active={active === 'structure'} onclick={() => onClickTab('structure')}
      >STRUCTURE</button
    >
  </li>
  <li>
    <button class:active={active === 'snapshots'} onclick={() => onClickTab('snapshots')}
      >SNAPSHOTS</button
    >
  </li>
</ul>

<style>
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
    color: var(--color-white);
    cursor: pointer;
    height: 100%;
    font-size: var(--font-medium);
    font-weight: 400;
    padding: 1em;
  }
  button:hover {
    background: rgba(var(--color-white-rgb), 0.05);
  }
  button.active {
    border-bottom: 2px solid var(--color-red-light);
  }
</style>
