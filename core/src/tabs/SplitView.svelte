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
    & > :global(*) {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow: scroll;
      padding: 1em 1em 4em 1em;
    }
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
    padding: 1em 1em 4em 1em;
  }
  * :global(.tree-view) {
    padding-bottom: 4em;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 1;
    overflow: scroll;
    padding: 1em 1em 4em 1em;
  }
</style>

<script lang="ts">
  // import { getContext } from 'svelte'

  // import TreeView from '../svelte-tree-view/Main.svelte'
  // import { APP_CONTEXT } from '../context.ts'

  export let leftPanelWidth, rightPanelWidth
  $: leftStyles = leftPanelWidth ? `width: ${leftPanelWidth}px` : ''
  $: rightStyles = rightPanelWidth ? `width: ${rightPanelWidth}px` : ''
</script>

<section>
  <slot class="left-panel" style={leftStyles} name="left" />
  <slot class="right-panel" style={rightStyles} name="right" />
</section>
