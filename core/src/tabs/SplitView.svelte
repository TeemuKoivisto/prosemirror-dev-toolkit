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
  :global(h2) {
    color: #bb91a3;
    font-family: Helvetica Neue, Calibri Light, Roboto, sans-serif;
    font-size: 13px;
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
    &[data-width] {
      width: attr(data-width);
    }
  }
  * :global(.tree-view) {
    padding-bottom: 4em;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
    &[data-width] {
      width: attr(data-width);
    }
  }
</style>

<script lang="ts">
  // import { getContext } from 'svelte'

  // import TreeView from '../svelte-tree-view/Main.svelte'
  // import { APP_CONTEXT } from '../context.ts'

  export let leftPanelWidth, rightPanelWidth
</script>

<section>
  <div class="left-panel" data-width={leftPanelWidth}>
    <slot name="left" />
  </div>
  <div class="right-panel" data-width={rightPanelWidth}>
    <slot name="right" />
  </div>
</section>
