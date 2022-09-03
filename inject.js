/**
 * This is a script to inject prosemirror-dev-toolkit into any live editor instance
 *
 * Basically what you do is inspect the element ProseMirror editor is mounted to,
 * a div with .ProseMirror class is a good guess. Then you just copy-paste this script
 * to the browser console and change the `viewOrSelector` parameter as needed.
 *
 * If there is a strict CSP enabled you might need to disable it. I've used this:
 * https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden
 */
;(async viewOrSelector => {
  function getEditorView(selector) {
    const el = document.querySelector(selector)
    const oldFn = el.pmViewDesc.updateChildren
    const childWithSelectNode = Array.from(el.children).find(
      child => child.pmViewDesc && child.pmViewDesc.selectNode !== undefined
    )

    if (childWithSelectNode === undefined) {
      console.error(
        'Failed to find a ProseMirror child NodeViewDesc with selectNode function (which is strange)'
      )
    } else {
      childWithSelectNode.pmViewDesc.selectNode()
      childWithSelectNode.pmViewDesc.deselectNode()
    }
    return new Promise((res, rej) => {
      el.pmViewDesc.updateChildren = (view, pos) => {
        el.pmViewDesc.updateChildren = oldFn
        res(view)
        return Function.prototype.bind.apply(oldFn, view, pos)
      }
    })
  }

  const editorView =
    typeof viewOrSelector === 'string' ? await getEditorView(viewOrSelector) : viewOrSelector

  if (editorView) {
    fetch('https://unpkg.com/prosemirror-dev-toolkit/dist/bundle.umd.min.js')
      .then(response => response.text())
      .then(data => {
        eval(data)
        window.applyDevTools(editorView, { buttonPosition: 'bottom-right' })
      })
  } else {
    console.error('No EditorView found or provided')
  }
})('.ProseMirror')
