<template>
  <div id="timelineContainer">
    <span style="display: inline-block; margin-right: 5px;">Max:</span>
    <input type="number" style="width: 30px; margin-right: 5px;" min="0" v-model="frameMax" />
    <span style="display: inline-block; margin-right: 5px;">frame: {{frameNum}}</span>
    <input style="width: 40px;" type="range" v-model="frameNum" :max="frameMax">
    <span style="display: inline-block; margin:0px 5px;">speed: </span>
    <input type="number" style="width: 40px; margin-right: 5px;" min="1" max="100" v-model="speed" />
  </div>
</template>
<script>
import EventBus from '../Eventbus';
export default {
  name: 'BCan',
  props: {
    curPos: {
      type: Object,
      default: function(){
        return null;
      }
    }
  },
  data: function(){
    return{
      speed: 40,
      frameNum: 0,
      frameMax: 3,
      rec: false,
      playing: false
    }
  },
  watch:{
    curPos(pnt){
      if(this.rec){
        if(pnt){
          this.addFrame();
        }else{
          this.frameNum = 0;
        }
      }
    },
    frameNum(v){
      EventBus.$emit('frameChange', v);
    }
  },
  methods:{
    addFrame(){
      if(this.frameNum < this.frameMax){
        this.frameNum++;
      }else{
        if(this.rec){
          this.frameMax++;
        }else{
          this.frameNum = 0;
        }
      }
    },
    tick(){
      setTimeout(() => {
        if(this.playing){
          window.requestAnimationFrame(this.tick);
          this.addFrame();
        }
      }, this.speed);
    },
    toggleRec(){
      this.rec = !this.rec;
    },
    togglePlay(){
      if(this.rec){
        this.rec = false;
      }else{
        this.playing = !this.playing;
      }

      if(this.playing){
        this.startTick();
      }
    },
    startTick(){
      window.requestAnimationFrame(this.tick);
    }
  },
  mounted(){
    EventBus.$on('playToggle', (v) => {
      this.togglePlay();
    })
    document.addEventListener('keydown', (e)=>{
      if(e.which == 32){
        this.togglePlay();
      }
    });

    this.$nextTick(() => {
      this.startTick();
    });
  }
}
</script>
<style scoped>
#timelineContainer{
  text-align: center;
  box-sizing: border-box;
  position: absolute;
  width: 75%;
  top: 50px;
  z-index: 9999;
  border: 2px solid;
  padding: 10px;
  background-color:#FFF;
}
.recording{
  color:#FFF;
  background-color:#F00;
}
#recBtn{
  display: inline-block;
  border: 2px solid;
  margin-right: 10px;
  padding: 5px;
  cursor: pointer;
  }
  #recBtn:hover{
    background-color: #F00;
    color: #FFF;
  }
#playBtn{
  display: inline-block;
  border: 2px solid;
  margin-right: 10px;
  padding: 5px;
  cursor: pointer;
  }
  #playBtn:hover{
    background-color: #000;
    color: #FFF;
  }
</style>
