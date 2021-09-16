<section class="split-view">
  <slot class="left-panel" name="left" />
  <slot class="right-panel" name="right" />
</section>

<style lang="scss">
  section {
    border-top: 1px solid rgba($color-red-light, 0.2);
    color: var(--color-white);
    display: flex;
    height: calc(100% - var(--height-tabs-menu));
    width: 100%;
  }
  :global(.split-view h2) {
    color: var(--color-red-gray);
    font-family: var(--font-sans);
    font-size: var(--font-medium);
    font-weight: 400;
    letter-spacing: 1px;
    margin: 0;
    text-transform: uppercase;
  }
  :global(.split-view > .left-panel) {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
  }
  :global(.split-view > .right-panel) {
    border-left: 1px solid rgba($color-red-light, 0.2);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
  }
  :global(.split-view .hidden) {
    visibility: hidden;
  }
</style>
