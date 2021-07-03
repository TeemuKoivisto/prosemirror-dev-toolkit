<style lang="scss">
  ul {
    color: white;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  li {
    transition: background 0.1s;
    &:hover {
      background: rgba(255, 162, 177, 0.4);
      color: white;
    }
    &:active {
      background: rgba(255, 162, 177, 0.6);
    }
    &.selected {
      background: rgba(255, 162, 177, 0.4);
    }
  }
  li + li {
    border-top: 1px solid #604c68;
  }
  button {
    background: transparent;
    border: 0;
    color: #d3d3d9;
    cursor: pointer;
    display: flex;
    font-family: monospace;
    font-size: var(--font-small);
    height: 100%;
    justify-content: space-between;
    padding: 6px 18px;
    text-transform: uppercase;
    width: 100%;

    &.p-left {
      margin-left: 1em;
    }
  }
  .caret-icon::before {
    content: '▶';
  }
  .caret-icon.expanded::before {
    content: '▼';
  }
</style>

<script lang="ts">
  export let listItems = [],
    selectedId,
    onSelect
</script>

<ul>
  {#each listItems as group, groupIdx}
    <li class:selected={!group.expanded && selectedId === group.topEntry.id}>
      <button
        class:is-group={group.isGroup}
        on:click={() => onSelect(group.topEntry.id, groupIdx, true)}
      >
        <span>
          {group.topEntry.timeStr}
          {#if group.isGroup}
            [{group.entries.length}]
          {/if}
        </span>
        {#if group.isGroup && group.entries.length > 1}
          <span class="caret-icon" class:expanded={group.expanded} />
        {/if}
      </button>
    </li>
    {#if group.isGroup && group.expanded}
      {#each group.entries as subEntry}
        <li class:selected={selectedId === subEntry.id}>
          <button class="p-left" on:click={() => onSelect(subEntry.id, groupIdx, false)}>
            {subEntry.timeStr}
          </button>
        </li>
      {/each}
    {/if}
  {/each}
</ul>
