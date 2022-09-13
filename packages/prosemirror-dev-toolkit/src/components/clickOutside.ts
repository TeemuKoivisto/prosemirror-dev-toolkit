export function clickOutside(node: HTMLElement, cb: () => void) {
  const onClick = (event: MouseEvent) =>
    node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented && cb()

  document.addEventListener('click', onClick, true)

  return {
    destroy() {
      document.removeEventListener('click', onClick, true)
    }
  }
}
