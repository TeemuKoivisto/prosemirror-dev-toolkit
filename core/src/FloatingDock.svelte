<script lang="ts">
  export let onClick
</script>

<style lang="css">
  .floating-dock-wrapper {
    position: fixed;
    width: 0px;
    height: 0px;
    top: 0px;
    left: 0px;
    z-index: 99999999;
  }
  .floating-dock {
    position: fixed;
    z-index: 1;
    box-shadow: rgb(0 0 0 / 30%) 0px 0px 4px;
    background: white;
    left: 0px;
    top: 50%;
    width: 100%;
    height: 50%;
    transition: left 0.2s ease-out 0s, top 0.2s ease-out 0s, width 0.2s ease-out 0s,
      height 0.2s ease-out 0s;
  }
</style>

<div class="floating-dock-wrapper" on:click={onClick}>
  <div class="floating-dock">
    <p>I am very large thing</p>
  </div>
</div>
