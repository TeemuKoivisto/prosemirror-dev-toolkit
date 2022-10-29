<script lang="ts">
  import { getContext, onDestroy, onMount, setContext } from 'svelte'
  import { writable } from 'svelte/store'

  // import { createStateStore } from '../stores/state'
  // import type { Stores } from '../stores'
  // import type { Message } from '../types'
  // import * as chrome from './chrome'

  interface Received {
    from: 'chrome' | 'window'
    data: any
  }

  // const stateStore = createStateStore()

  // setContext<Stores>('pop-up', {
  //   stateStore
  // })

  const received = writable<Received[]>([])
  let count = 0,
    foundInstances = 0

  async function handleClick() {
    chrome.runtime.sendMessage({ type: 'badge', data: {} })
    // isActive.set(!$isActive)
  }

  onMount(async () => {
    chrome.runtime.sendMessage({ type: 'pop-up-open', data: 'open' })
    // window.postMessage({ type: 'pop-up-open', data: 'open' }, '*')
  })

  chrome.runtime.onMessage.addListener((ev: any) => {
    if (ev && 'type' in ev && 'data' in ev) {
      switch (ev.type) {
        case 'sw-found':
          foundInstances = ev.data
          break
      }
    }
    received.update(msgs => [...msgs, { from: 'chrome', data: ev }])
    count += 1
  })

  window.addEventListener('message', ev => {
    if ('type' in ev.data) {
      switch (ev.data.type) {
        case 'pop-up-msgs':
          received.set(ev.data.data)
          break
        case 'found-instances':
          foundInstances = ev.data.data
          break
      }
    }
    received.update(msgs => [...msgs, { from: 'window', data: ev.data }])
    count += 1
  })
</script>

<div>
  <h1>
    {#if foundInstances > 0}
      ProseMirror detected
    {:else}
      No ProseMirror found
    {/if}
  </h1>
  <p>Count: {count}</p>
  <ul>
    {#each $received as msg}
      <li>{JSON.stringify(msg)}</li>
    {/each}
  </ul>
  <button on:click={handleClick}>msg</button>
</div>

<style lang="scss">
  // div {
  //   display: flex;
  //   overflow: hidden;
  //   flex: 1 1 0;
  //   flex-direction: column;
  // }

  ul {
    list-style: none;
    padding: 0;
  }
  li + li {
    border-top: 1px solid #222;
    margin-top: 4px;
    padding-top: 4px;
  }
</style>
