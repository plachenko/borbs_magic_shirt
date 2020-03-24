<template>
  <div id="app">

    <!--
    <div style="postion: absolute; top: 0px; left: 0px; flex:1;">
      <input v-model="width" />
      <input v-model="height" />
    </div>
    -->
    <div style="padding-top: 10px; display: flex; justify-content: center; align-items: center;">
      <BCan :color="color" @colorEvt="coloring = !coloring" />
      <BColor v-show="coloring" @colorSelect="color = $event" />
    </div>
    <!-- <a href="#" @click="coloring = !coloring">color</a> -->
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
      width: 600,
      height: 600
    }
  }
}
</script>

<style>
*{
  user-select: none;
}
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
  flex-flow: column;
  justify-content: center;
  }

</style>
