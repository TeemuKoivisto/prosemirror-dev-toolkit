import { render, fireEvent } from '@testing-library/svelte'
import Button from '../Button.svelte'
import { vi } from 'vitest'

describe('Button component', () => {
  it('should render', async () => {
    const onClick = vi.fn()
    const results = render(Button, { props: { onclick: onClick } })

    const button = results.container.querySelector('button')
    expect(button).not.toBeNull()

    // Using await when firing events is unique to the svelte testing library because
    // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
    await fireEvent.click(button as HTMLElement)

    expect(results.container).toBeInTheDocument()
    expect(onClick.mock.calls.length).toEqual(1)
  })
})
