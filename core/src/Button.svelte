<script lang="ts">
  export let selected = false
  let buttonProps = {
    class: [$$restProps.class]
  }
</script>

<button on:click on:mouseover on:mouseenter on:mouseleave {...buttonProps} class:selected
  ><slot /></button
>

<style lang="scss">
  button {
    background: transparent;
    border: 0;
    border-radius: 2px;
    color: var(--color-gray-light);
    cursor: pointer;
    font-size: var(--font-small);
    padding: 6px 10px;
    text-transform: uppercase;
    &:hover {
      background: rgba($color-red-light, 0.4);
      color: var(--color-white);
    }
    &.selected {
      background: rgba($color-red-light, 0.4);
    }
  }
</style>
