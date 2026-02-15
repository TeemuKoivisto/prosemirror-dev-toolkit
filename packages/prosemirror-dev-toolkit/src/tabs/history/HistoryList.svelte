<script lang="ts">
  import type { HistoryEntry } from '$typings/history'

  interface Props {
    listItems?: {
      id: number
      isGroup: boolean
      topEntry: HistoryEntry | undefined
      entries: (HistoryEntry | undefined)[]
      expanded: boolean
    }[]
    selectedId: string
    onClickItem: (detail: { id: string | undefined; groupIdx: number; wasTopNode: boolean }) => void
    onDblclickItem: (detail: { id?: string }) => void
  }
  const { listItems = [], selectedId, onClickItem, onDblclickItem }: Props = $props()
</script>

<ul>
  {#each listItems as group, groupIdx (group.id)}
    <li class:selected={!group.expanded && selectedId === group?.topEntry?.id}>
      <button
        class:is-group={group.isGroup}
        onclick={() => onClickItem({ id: group?.topEntry?.id, groupIdx, wasTopNode: true })}
        ondblclick={() => onDblclickItem({ id: group?.topEntry?.id })}
      >
        <span>
          {group?.topEntry?.timeStr}
          {#if group.isGroup}
            [{group.entries.length}]
          {/if}
          {#if group.topEntry && group.topEntry.trs.length > 1}
            +{group.topEntry.trs.length - 1}
          {/if}
        </span>
        {#if group.isGroup && group.entries.length > 1}
          <span class="caret-icon" class:expanded={group.expanded}></span>
        {/if}
      </button>
    </li>
    {#if group.isGroup && group.expanded}
      {#each group.entries as subEntry (subEntry?.id)}
        <li class:selected={selectedId === subEntry?.id}>
          <button
            class="p-left"
            onclick={() => onClickItem({ id: subEntry?.id, groupIdx, wasTopNode: false })}
          >
            {subEntry?.timeStr}
          </button>
        </li>
      {/each}
    {/if}
  {/each}
</ul>

<style>
  ul {
    color: var(--color-white);
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  li {
    transition: background 0.7s ease;
  }
  li:hover {
    background: rgba(var(--color-red-light-rgb), 0.4);
    color: var(--color-white);
  }
  li.selected {
    background: rgba(var(--color-red-light-rgb), 0.4);
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
    font-size: var(--font-medium);
    justify-content: space-between;
    padding: 6px 18px;
    text-transform: uppercase;
    width: 100%;
  }
  button.p-left {
    margin-left: 1em;
  }
  .caret-icon::before {
    content: '▶';
  }
  .caret-icon.expanded::before {
    content: '▼';
  }
</style>
