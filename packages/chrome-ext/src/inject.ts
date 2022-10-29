import { applyDevTools } from 'prosemirror-dev-toolkit'

let timeout: ReturnType<typeof setTimeout>,
  attempts = 0,
  pmEl: HTMLElement | undefined

function getEditorView(el: HTMLElement): Promise<any> {
  console.log(el.pmViewDesc)
  // @ts-ignore
  const oldFn = el.pmViewDesc.updateChildren
  const childWithSelectNode = Array.from(el.children).find(
    // @ts-ignore
    child => child.pmViewDesc && child.pmViewDesc.selectNode !== undefined
  )

  if (childWithSelectNode === undefined) {
    console.error(
      'Failed to find a ProseMirror child NodeViewDesc with selectNode function (which is strange)'
    )
  } else {
    // @ts-ignore
    childWithSelectNode.pmViewDesc.selectNode()
    // @ts-ignore
    childWithSelectNode.pmViewDesc.deselectNode()
  }
  return new Promise((res, rej) => {
    // @ts-ignore
    el.pmViewDesc.updateChildren = (view, pos) => {
      // @ts-ignore
      el.pmViewDesc.updateChildren = oldFn
      res(view)
      // @ts-ignore
      return Function.prototype.bind.apply(oldFn, view, pos)
    }
  })
}

function queryDOM(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      const el = document.querySelector('.ProseMirror')
      if (el && el instanceof HTMLElement) {
        pmEl = el
        resolve(true)
      } else {
        attempts += 1
        resolve(false)
      }
    }, 1000 * attempts)
  })
}

async function findProsemirror() {
  const found = await queryDOM()
  if (!found && attempts < 5) {
    findProsemirror()
  } else if (found && pmEl) {
    const view = await getEditorView(pmEl)
    applyDevTools(view, { buttonPosition: 'bottom-right' })
  }
}

window.addEventListener('load', async event => {
  findProsemirror()
})

export {}
