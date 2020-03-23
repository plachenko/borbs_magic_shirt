<template>
  <div id="app">
    <!-- <a href="#" @click="coloring = !coloring">color</a> -->
    <BCan :color="color" />
    <BColor @colorSelect="color = $event" />
  </div>
</template>

<script>
import BCan from './components/BCan';
import BColor from './components/BColor';

export default {
  name: 'App',
  components: {
    BCan,
    BColor
  },
  data: function(){
    return{
      coloring: false,
      color: "rgb(0,0,0)",
    }
  }
}
</script>

<style>
html, body{
  margin: 0px;
  padding: 0px;
  height: 100%;
  touch-action: none;
}
#app {
  overflow: hidden;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  }

</style>
