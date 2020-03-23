<template>
  <div class="home">
    <div ref="hand" style="background-color:#F00; right: 0px; height: 120px; position: absolute;"></div>
    <BCan />
  </div>
</template>

<script>
// @ is an alias to /src
import BCan from '../components/BCan'

export default {
  name: 'Home',
  components: {
    BCan
  },
  mounted(){
    window.addEventListener('mousemove', (e)=> {
      this.$refs.hand.style.width = (window.innerWidth - e.offsetX) - 40 + "px";
      this.$refs.hand.style.top = e.offsetY + "px";
    })
  }
}
</script>
