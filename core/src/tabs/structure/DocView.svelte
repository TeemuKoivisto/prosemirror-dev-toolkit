<style lang="scss">
  ul {
    color: white;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
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
    font-size: 11px;
    height: 100%;
    padding: 6px 18px;
    text-transform: uppercase;
    width: 100%;
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
  import { setContext } from 'svelte'
  import DocNode from './DocNode.svelte'
  import { buildColors } from './colors.ts'

  export let doc,
    schema,
    selected = { type: '', start: 0, end: 0 },
    handleNodeSelect

  setContext('doc-view', {
    selected,
    colors: buildColors(schema),
    handleNodeClick(n: any) {
      handleNodeSelect(n)
    }
  })
</script>

<DocNode class={$$props.class} node={doc} startPos={0} depth={0} isRoot />
