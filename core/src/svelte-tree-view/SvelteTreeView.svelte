<style>
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import TreeNode from './TreeNode.svelte'
  import { APP_CONTEXT, createContext } from './context.ts'
  import type { ITreeNode } from './types.ts'

  export let data

  createContext(data)
  const { getRootNode } = getContext(APP_CONTEXT)

  let tree: ITreeNode = getRootNode()
  console.log(tree)
</script>

<section>
  {#each tree.children as child}
    <TreeNode key={child.id} />
  {/each}
</section>
