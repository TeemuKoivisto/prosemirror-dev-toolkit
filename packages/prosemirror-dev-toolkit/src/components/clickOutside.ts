export function clickOutside(el: HTMLElement, onClickOutside: () => void) {
  const onClick = (event: MouseEvent) => {
    el && !event.composedPath().includes(el) && !event.defaultPrevented && onClickOutside()
  }

  document.addEventListener('click', onClick, true)

  return {
    destroy() {
      document.removeEventListener('click', onClick, true)
    }
  }
}
