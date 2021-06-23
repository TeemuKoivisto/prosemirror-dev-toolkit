<style lang="scss">
  button {
    background: transparent;
    border: 0;
    border-radius: 2px;
    color: #d3d3d9;
    cursor: pointer;
    font-size: var(--font-small);
    padding: 6px 10px;
    text-transform: uppercase;
    &:hover {
      background: rgba(255, 162, 177, 0.4);
      color: white;
    }
    &.selected {
      background: rgba(255, 162, 177, 0.4);
    }
  }
</style>

<script lang="ts">
  export let selected = false
  let buttonProps = {
    class: [$$restProps.class]
  }
</script>

<button on:click on:mouseover on:mouseenter on:mouseleave {...buttonProps} class:selected
  ><slot /></button
>
