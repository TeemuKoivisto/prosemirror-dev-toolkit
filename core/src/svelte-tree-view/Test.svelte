<script lang="ts">
  import { writable, derived, get } from 'svelte/store'

  function createMapStore(initial: Object) {
    const store = writable(initial)

    const set = (key: string, value: any) =>
      store.update(m => Object.assign({}, m, { [key]: value }))

    const results = derived(store, s => ({
      keys: Object.keys(s),
      values: Object.values(s),
      entries: Object.entries(s),
      set(k, v) {
        store.update(s => Object.assign({}, s, { [k]: v }))
      },
      remove(k) {
        store.update(s => {
          delete s[k]
          return s
        })
      }
    }))
    return {
      subscribe: results.subscribe,
      set: store.set
    }
  }

  const store = createMapStore({
    a: 1,
    b: 2,
    c: 3
  })
</script>

{#each $store.entries as [key, value]}
  <div>{key}: {value}</div>
{/each}

<button on:click={() => $store.remove('b')}>Delete b</button>
<button on:click={() => $store.set('c', 4)}>Set c to 4</button>
