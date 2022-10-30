<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  import type { FoundInstance, PopUpMessages, SWMessageMap } from '../types'

  interface Received {
    from: 'chrome' | 'window'
    data: any
  }

  const received = writable<Received[]>([])
  let count = 0,
    foundInstances = 0,
    disabled = false,
    editors: FoundInstance[] = []

  onMount(() => {
    send('mount-pop-up', true)
    chrome.runtime.onMessage.addListener(listen)
  })

  function send<K extends keyof PopUpMessages>(type: K, data: PopUpMessages[K]) {
    chrome.runtime.sendMessage({ source: 'pm-dev-tools', origin: 'pop-up', type, data })
  }

  function listen<K extends keyof SWMessageMap>(
    raw: SWMessageMap[K],
    _sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: any) => void
  ) {
    if (typeof raw !== 'object' || !('source' in raw) || raw.source !== 'pm-dev-tools') {
      return
    }
    switch (raw.type) {
      case 'pop-up-data':
        disabled = raw.data.disabled
        editors = raw.data.instances
        break
    }
    received.update(msgs => [...msgs, { from: 'chrome', data: msg }])
    count += 1
  }

  function handleClickDisable() {
    send('toggle-disable', true)
  }
</script>

<main>
  <h1>
    {#if foundInstances > 0}
      ProseMirror detected
    {:else}
      No ProseMirror found
    {/if}
  </h1>
  <div class="field">
    <label for="pm-el-selector">Selector</label>
    <input id="pm-el-selector" value=".ProseMirror" />
  </div>
  <div>
    <button>Reload</button>
    <button>Data</button>
    <button on:click={handleClickDisable}>{disabled ? 'Enable' : 'Disable'}</button>
    <button>Disable for page</button>
  </div>
  <p>Count: {count}</p>
  <ul>
    {#each editors as inst}
      <li>
        <button class="editor-btn" class:selected={true}>Size: {inst.size} {inst.classes}</button>
      </li>
    {/each}
  </ul>
  <ul>
    {#each $received as msg}
      <li>{JSON.stringify(msg)}</li>
    {/each}
  </ul>
</main>

<style lang="scss">
  main {
    min-width: 600px;
  }
  h1 {
    font-size: 20px;
  }
  .selected {
    background: lightblue;
  }
  .editor-btn {
    background: transparent;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    margin: 0;
    padding: 10px;
    &.selected {
      border: 2px solid #666;
    }
  }
  .field {
    display: flex;
    flex-direction: column;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li + li {
    margin-top: 4px;
    padding-top: 4px;
  }
</style>
