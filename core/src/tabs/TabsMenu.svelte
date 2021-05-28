<style lang="scss">
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li > button {
    background: transparent;
    border: 0;
    color: white;
    padding: 1em;
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
</style>

<script lang="ts">
  export let onClickTab
</script>

<ul class="tabs-menu">
  <li>
    <button on:click={() => onClickTab('state')}>STATE</button>
  </li>
  <li>
    <button on:click={() => onClickTab('history')}>HISTORY</button>
  </li>
  <li><button on:click={() => onClickTab('close')}>X</button></li>
</ul>
