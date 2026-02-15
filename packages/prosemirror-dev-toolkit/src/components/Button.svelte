<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'

  interface Props extends HTMLAttributes<HTMLButtonElement> {
    selected?: boolean
    children?: Snippet<[]>
  }
  const { selected, children, ...rest }: Props = $props()
</script>

<button {...rest} class:selected>{@render children?.()}</button>

<style>
  button {
    background: transparent;
    border: 0;
    border-radius: 2px;
    color: var(--color-gray-light);
    cursor: pointer;
    font-family: var(--font-family);
    font-size: var(--font-small);
    font-weight: 400;
    padding: 6px 10px;
    text-transform: uppercase;
  }
  button:hover {
    background: rgba(var(--color-red-light-rgb), 0.4);
    color: var(--color-white);
  }
  button.selected {
    background: rgba(var(--color-red-light-rgb), 0.4);
  }
</style>
