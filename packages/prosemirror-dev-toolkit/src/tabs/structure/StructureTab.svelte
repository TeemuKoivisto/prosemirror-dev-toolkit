<script lang="ts">
  import type { Node as PMNode, Schema } from 'prosemirror-model'
  import { getContext } from '$context'
  import { latestEntry } from '$stores/stateHistory'

  import TreeView from 'svelte-tree-view'
  import SplitView from '../SplitView.svelte'
  import DocView from './DocView.svelte'
  import Button from '$components/Button.svelte'

  const { view } = getContext('editor-view')
  let doc: PMNode = view.state.doc
  let selected = { node: view.state.doc, pos: 0 }
  $: jsonNode = selected.node.toJSON()
  let schema: Schema = view.state.schema
  let timer: ReturnType<typeof setTimeout>

  latestEntry.subscribe(e => {
    if (!e) return
    e.trs.forEach(tr => {
      selected.pos = tr.mapping.map(selected.pos)
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      doc = e.state.doc
      const pos = selected.pos
      try {
        // Must try-catch incase dev-tools is unmounted and editorView destroyed
        const node = doc.nodeAt(pos)
        selected = { node: node || doc, pos: node ? pos : 0 }
      } catch (err) {}
    }, 100)
  })

  /**
   * Finds first parent that is scrollable
   *
   * Could use getComputedStyle(el).overflowY !== 'visible' but this seems to work ok as well.
   * @param el
   */
  function getScrollableParent(el: HTMLElement | null | undefined): HTMLElement | undefined {
    if (!el || el === document.body) return undefined
    else if (el.scrollHeight !== el.clientHeight) return el
    return getScrollableParent(el.parentElement)
  }
  function handleNodeSelect(node: PMNode, startPos: number, scroll = false) {
    selected = { node, pos: startPos }
    if (!scroll) return
    /**
     * Some high order black magic right here for scrolling the node into view.
     *
     * First, we need to ensure the node is visible within a scrollable element.
     * Meaning that if there's a parent element with overflow: scroll/auto we have to
     * scroll the element into view.
     */
    let nodeDom = view.nodeDOM(startPos)
    // Text nodes don't have offsetTop property so we have to find a parent which has
    while (nodeDom && !(nodeDom instanceof HTMLElement)) {
      nodeDom = nodeDom.parentElement
    }
    // We'll omit hidden nodes since it might be more obvious that there's nothing to scroll into
    if (!nodeDom || getComputedStyle(nodeDom).display === 'none') return
    const parentWithScrollbar = getScrollableParent(view.dom as HTMLElement)
    if (parentWithScrollbar) {
      const alreadyScrolled = parentWithScrollbar.scrollTop
      // So this is probably the most magic part. Basically if the parent has been scrolled over
      // in the viewport (meaning it's below the absolute position of the current viewport top),
      // we must offset the boundingRect's top as they are calculated from the viewport's top,
      // not where the parent element actually is. Otherwise we would scroll downwards even though
      // the node's top would already be enough to be shown. Real PITA to wrap your head around.
      // Hopefully nobody has to ever fix this 😅
      const parentOffset = parentWithScrollbar.offsetTop - window.scrollY
      const parentTop = parentWithScrollbar.getBoundingClientRect().top - parentOffset
      const nodeTop = nodeDom.getBoundingClientRect().top - parentOffset
      // clientHeight / 2 seems to work as a carefully crafted heurestic..
      const halfwayParent = parentWithScrollbar.clientHeight / 2
      parentWithScrollbar.scroll(0, alreadyScrolled + parentTop + nodeTop - halfwayParent)
    }
    /**
     * After that, incase the window has a scrollbar as well we want to scroll the
     * element just above the dock
     */
    const nodeTop = view.coordsAtPos(startPos).top
    const dockHeight = document.querySelector('.floating-dock')?.clientHeight || 0
    window.scroll(0, nodeTop - dockHeight + nodeDom.clientHeight + window.scrollY)
  }
  function handleClickLogNode() {
    console.log(selected)
    window._node = selected
    console.info('%c [prosemirror-dev-toolkit]: Property added to window._node', 'color: #b8e248')
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <div class="top-row">
      <h2>Current doc</h2>
      <Button class="hidden">log</Button>
    </div>
    <DocView class="m-top" {doc} {schema} {handleNodeSelect} />
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row">
      <h2>Node info</h2>
      <Button onclick={handleClickLogNode}>log</Button>
    </div>
    <TreeView
      class="m-top"
      data={jsonNode}
      recursionOpts={{
        shouldExpandNode: n => n.type !== 'array' || n.value.length <= 50
      }}
    />
  </div>
</SplitView>

<style>
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .right-panel[slot='right'] {
    border-left: 1px solid rgba(var(--color-red-light-rgb), 0.2);
    flex-grow: 0;
    min-width: 220px;
    width: 220px;
  }
  :global(.split-view .m-top) {
    margin-top: 0.75em;
  }
</style>
