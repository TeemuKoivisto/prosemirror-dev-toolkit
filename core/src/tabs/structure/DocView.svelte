<script lang="ts">
  import { setContext } from 'svelte'
  import DocNode from './DocNode.svelte'
  import { buildColors } from './colors'

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
