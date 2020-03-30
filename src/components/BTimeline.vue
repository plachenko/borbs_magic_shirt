<template>
  <div class="container">
    <span id="playBtn" @click="togglePlay">{{playing ? 'stop' : 'play'}}</span>
    <span style="display: inline-block; margin-right: 10px;">frame: {{frameNum}}</span>
    <input style="width: 40px;" type="range" v-model="frameNum" :max="frameMax">
    <span style="display: inline-block; margin:0px 10px;">speed: {{speed / 1000}}</span>
    <input style="width: 40px;" type="range" v-model="speed" max="1000" min="10" step="10">
  </div>
</template>
<script>
import EventBus from '../Eventbus';
export default {
  name: 'BCan',
  data: function(){
    return{
      speed: 800,
      frameNum: 0,
      frameMax: 9,
      playing: false
    }
  },
  watch:{
    frameNum(v){
      EventBus.$emit('frameChange', v);
    }
  },
  methods:{
    tick(){
      setTimeout(() => {
        if(this.playing){
          window.requestAnimationFrame(this.tick);
          if(this.frameNum < this.frameMax){
            this.frameNum++;
          }else{
            this.frameNum = 0;
          }
        }
      }, this.speed);
    },
    togglePlay(){
      this.playing = !this.playing;
      if(this.playing){
        this.startTick();
      }
    },
    startTick(){
      window.requestAnimationFrame(this.tick);
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.startTick();
    });
  }
}
</script>
<style scoped>
.container{
  box-sizing: border-box;
  position: absolute;
  bottom: -70px;
  width: 100%;
  border: 2px solid;
  padding: 10px;
  background-color:#FFF;
}
#playBtn{
  display: inline-block;
  border: 2px solid;
  margin-right: 10px;
  padding: 5px;
  cursor: pointer;
  }
  #playBtn:hover{
    background: #000;
    color: #FFF;
  }
</style>
