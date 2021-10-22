<script lang="ts">
  import { setContext } from '$context'
  import type { Node as PMNode, Schema } from 'prosemirror-model'

  import DocNode from './DocNode.svelte'
  import { buildColors } from './colors'

  export let doc: PMNode,
    schema: Schema,
    selected = { type: '', start: 0, end: 0 },
    handleNodeSelect: (n: PMNode) => void

  setContext('doc-view', {
    selected,
    colors: buildColors(schema),
    handleNodeClick: handleNodeSelect
  })
</script>

<ul>
  <DocNode class={$$props.class} node={doc} startPos={0} depth={0} isRoot />
</ul>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
