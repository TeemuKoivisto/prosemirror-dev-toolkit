<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  import type { PopUpMessages, SWMessages } from '../types/messages'

  interface Received {
    from: 'chrome' | 'window'
    data: any
  }

  const received = writable<Received[]>([])
  let count = 0,
    foundInstances = 0

  function handleClick() {
    send('badge', true)
  }

  onMount(() => {
    send('open', true)
  })

  function send<K extends keyof PopUpMessages>(type: K, data: PopUpMessages[K]) {
    chrome.runtime.sendMessage({ source: 'pm-dev-tools', type, data })
  }

  function listen<K extends keyof SWMessages>(
    msg: { source: 'pm-dev-tools'; type: K; data: SWMessages[K] },
    _sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: any) => void
  ) {
    if (!('source' in msg) || msg.source !== 'pm-dev-tools') return
    const type = msg.type as keyof SWMessages
    switch (type) {
      case 'current_instances':
        foundInstances = msg.data as SWMessages['current_instances']
        break
    }
    received.update(msgs => [...msgs, { from: 'chrome', data: msg }])
    count += 1
  }

  chrome.runtime.onMessage.addListener(listen)
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
