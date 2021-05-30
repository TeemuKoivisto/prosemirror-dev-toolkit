<style lang="scss">
  :root {
    --json-tree-label-color: rgb(133, 217, 239);
    --json-tree-string-color: rgb(184, 226, 72);
    --json-tree-number-color: rgb(184, 226, 72);
  }
  section {
    border-top: 1px solid rgba(255, 162, 177, 0.2);
    color: white;
    display: flex;
    height: 100%;
    width: 100%;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }
  h2 {
    font-size: 1em;
    font-weight: 400;
    margin: 0;
    text-transform: uppercase;
  }
  .left-panel {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'

  import { APP_CONTEXT } from '../context.ts'
  import JSONTree from 'svelte-json-tree'
  import TreeView from '../svelte-tree-view/Main.svelte'

  const { view } = getContext(APP_CONTEXT)

  const ignoreFields = ['schema', 'contentExpr', 'schema', 'parseDOM', 'toDOM']

  export function postprocessValue(ignore, data) {
    if (!data || Object.prototype.toString.call(data) !== '[object Object]') {
      return data
    }
    return Object.keys(data)
      .filter(key => ignore.indexOf(key) === -1)
      .reduce((res, key) => {
        res[key] = data[key]
        return res
      }, {})
  }

  function iterateNodes(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      const val = { ...obj[key] }
      delete val['schema']
      acc[key] = val
      return acc
    }, {})
    // return Object.entries(view.state.schema.nodes).reduce((acc, [key, val]) => {
    //   if (key !== 'schema') {
    //     acc[key] = val
    //   }
    //   return acc
    // }, {})
  }
  let nodes = iterateNodes(view.state.schema.nodes)
  let marks = iterateNodes(view.state.schema.marks)
</script>

<section>
  <div class="left-panel">
    <div class="top-row">
      <h2>Nodes</h2>
    </div>
    <TreeView data={nodes} showLogButton showCopyButton maxDepth={6} />
  </div>
  <div class="right-panel">
    <div class="top-row">
      <h2>Marks</h2>
    </div>
    <TreeView data={marks} showLogButton showCopyButton />
  </div>
</section>
