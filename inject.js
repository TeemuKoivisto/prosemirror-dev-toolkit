/**
 * This is a script to inject prosemirror-dev-toolkit into any live editor instance
 * 
 * Basically what you do is inspect the element ProseMirror editor is mounted to,
 * a div with .ProseMirror class is a good guess. Then you just copy-paste this script
 * to the browser console and change the `viewOrSelector` parameter as needed.
 * 
 * In some cases the EditorView instance is already available in the window and due 
 * to some errors I haven't figured out, can cause problems when intercepted again
 * with the el.pmViewDesc.updateChildren hack.
 * 
 * In that case (eg https://prosemirror.net/) just use the available view instance directly:
 * `window.view`. Also if there is a strict CSP enabled you might need to disable it.
 * I've used this: https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden
 */
((viewOrSelector) => {
  let editorView
  if (typeof viewOrSelector === 'string') {
    const el = document.querySelector(viewOrSelector)
    const oldFn = el.pmViewDesc.updateChildren
    el.pmViewDesc.updateChildren = (view, pos) => {
      editorView = view
      window.view = view
      return Function.prototype.bind.apply(oldFn, view, pos)
    }
    el.children[0].pmViewDesc.selectNode()
    el.children[0].pmViewDesc.deselectNode()
  } else {
    editorView = viewOrSelector
  }

  fetch('https://unpkg.com/prosemirror-dev-toolkit/dist/bundle.umd.min.js')
    .then(response => response.text())
    .then(data => {
      eval(data)
      window.applyDevTools(editorView, { buttonPosition: 'bottom-left' })
    })
})('.ProseMirror')
