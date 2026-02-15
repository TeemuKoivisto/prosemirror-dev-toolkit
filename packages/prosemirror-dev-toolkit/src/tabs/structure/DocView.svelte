<script lang="ts">
  import { setContext } from '$context'
  import type { Node as PMNode, Schema } from 'prosemirror-model'

  import DocNode from './DocNode.svelte'
  import { buildColors } from './colors'

  interface Props {
    doc: PMNode
    schema: Schema
    selected?: { type: string; start: number; end: number }
    handleNodeSelect: (n: PMNode, startPos: number, scroll?: boolean) => void
    class?: string
  }
  const {
    doc,
    schema,
    selected = { type: '', start: 0, end: 0 },
    handleNodeSelect,
    class: className
  }: Props = $props()

  setContext('doc-view', {
    selected,
    colors: buildColors(schema),
    handleNodeClick: handleNodeSelect
  })
</script>

<ul>
  <DocNode class={className} node={doc} startPos={0} depth={0} />
</ul>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
