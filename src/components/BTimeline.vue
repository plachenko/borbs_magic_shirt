<template>
  <div class="container">
    <span id="playBtn" v-if="!rec" @click="togglePlay">{{playing ? 'stop' : 'play'}}</span>
    <span id="recBtn" v-if="!playing" :class="{recording: rec}" @click="toggleRec">Rec</span>
    <span style="display: inline-block; margin-right: 10px;">Max:</span>
    <input type="number" style="width: 30px; margin-right: 10px;" min="0" v-model="frameMax" />
    <span id="loopBtn" v-if="rec" :class="{on: looping}" @click="looping = !looping">L</span>
    <span style="display: inline-block; margin-right: 10px;">frame: {{frameNum}}</span>
    <input style="width: 40px;" type="range" v-model="frameNum" :max="frameMax">
    <span style="display: inline-block; margin:0px 10px;">speed: {{speed / 1000}}s</span>
    <input style="width: 40px;" type="range" v-model="speed" max="300" min="10" step="10">
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
      speed: 60,
      frameNum: 0,
      frameMax: 3,
      rec: false,
      looping: false,
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
    },
    frameMax(v){
      EventBus.$emit('frameMax', v);
    }
  },
  methods:{
    addFrame(){
      if(this.frameNum < this.frameMax){
        this.frameNum++;
      }else{
        if(this.rec && !this.looping){
          this.frameMax++;
        }else{
          this.frameNum = 0;
        }
      }
    },
    remFrame(){
      if(this.frameNum >= 0){
        this.frameNum--;
      }else{
        this.frameNum = this.frameMax;
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
    document.addEventListener('keydown', (e)=>{
      switch(e.which){
        case 90:
          this.remFrame();
          break;
        case 88:
          this.addFrame();
          break;
        case 32:
          this.togglePlay();
          break;
      }
    });

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
  width: 140%;
  left:-20%;
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
#loopBtn{
  display: inline-block;
  border: 2px solid;
  margin-right: 10px;
  padding: 5px;
  cursor: pointer;
  }
  .on, #loopBtn:hover{
    background-color: #000;
    color: #FFF;
    }
</style>
