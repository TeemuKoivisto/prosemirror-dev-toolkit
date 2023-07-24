<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { clickOutside } from './clickOutside'

  export let isOpen: boolean

  let doc: string

  const dispatch = createEventDispatcher<{
    submit: { doc: Record<string, any> }
    close: undefined
  }>()

  function handleClickOutside() {
    dispatch('close')
  }

  function handleSubmit() {
    try {
      dispatch('submit', { doc: JSON.parse(doc) })
    } catch (err) {}
  }
</script>

<div class="paste-modal" class:hidden={!isOpen}>
  <div class="modal-bg" />
  <form class="paste-content" on:submit|preventDefault={handleSubmit}>
    <fieldset use:clickOutside={handleClickOutside}>
      <div class="submit-container">
        <button>Submit</button>
      </div>
      <legend>Doc</legend>
      <textarea bind:value={doc} />
    </fieldset>
  </form>
</div>

<style lang="scss">
  .paste-modal {
    font-size: 15px;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
  .paste-modal > form {
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 64px;
  }
  .modal-bg {
    background: #000;
    height: 100%;
    left: 0;
    opacity: 0.8;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }
  fieldset {
    border-color: transparent;
    width: 100%;
    max-width: 800px;
  }
  .submit-container {
    position: relative;
    width: 100%;
  }
  button {
    cursor: pointer;
    padding: 4px 8px;
    position: absolute;
    right: -6px;
    top: -32px;
  }
  legend {
    color: white;
  }
  textarea {
    background: #fefcfc;
    height: calc(100vh - 128px);
    width: 100%;
  }
</style>
