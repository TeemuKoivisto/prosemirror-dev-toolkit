/**
 * @jest-environment jsdom
 */

import { render, fireEvent } from '@testing-library/svelte'
import Button from '../Button.svelte'

// https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-component/

describe('Button', () => {
  it('should render correctly', async () => {
    const results = render(Button)
    const onClick = jest.fn()
    results.component.$on('click', onClick)

    const button = results.container.querySelector('button')
    expect(button).not.toBeNull()

    // Using await when firing events is unique to the svelte testing library because
    // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
    await fireEvent.click(button as HTMLElement)

    expect(results.container).toBeInTheDocument()
    expect(onClick.mock.calls.length).toEqual(1)
  })
})
