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
    height: calc(100% - var(--height-tabs-menu));
    width: 100%;
  }
  :global(h2) {
    color: #bb91a3;
    font-family: var(--font-sans);
    font-size: var(--font-medium);
    font-weight: 400;
    margin: 0;
    text-transform: uppercase;
  }
  :global(.left-panel) {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
  }
  :global(.right-panel) {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
  }
</style>

<section>
  <slot class="left-panel" name="left" />
  <slot class="right-panel" name="right" />
</section>
