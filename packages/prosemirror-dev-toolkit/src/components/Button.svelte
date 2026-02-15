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

<style lang="scss">
  button {
    background: transparent;
    border: 0;
    border-radius: 2px;
    color: $color-gray-light;
    cursor: pointer;
    font-family: var(--font-family);
    font-size: var(--font-small);
    font-weight: 400;
    padding: 6px 10px;
    text-transform: uppercase;
    &:hover {
      background: rgba($color-red-light, 0.4);
      color: $color-white;
    }
    &.selected {
      background: rgba($color-red-light, 0.4);
    }
  }
</style>
