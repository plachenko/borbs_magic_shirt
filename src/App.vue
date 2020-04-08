<template>
  <div id="app">
    <!--
      =Borb's Magic Shirt=
      An HTML Canvas applcation that uses context2D to paint in time.

      Check out TomThinks on twitch to catch a borb painting stream!
      https://www.twitch.tv/tomthinks
    -->

    <!-- Modal that appears for extras -->
    <BModal :modalOpts="modalOpts" v-if="modalOpts" @exit="modalExit" />

    <input type="file" ref="file" @change="load" style="display:none" />

    <!-- The Event Capture -->
    <BEvent />

    <!-- Borb's shirt sleeve. -->
    <BSleeve />


    <!-- Middle Container -->
    <div id="container">
      <div id="middle">
        <!-- Reference Image that loads -->
        <div id="refImg" ref="refImg"></div>

        <!-- Menu items. -->
        <BMenu ref="menu" @modalShow="modalShow($event)" @modalExit="modalExit" />
        <BTimeline ref="timeline" v-show="timelineShow" />

        <!-- Paint Canvas -->
        <BCan ref="paintCan" />
        <!-- <BCan :frameMax="fMax" ref="paintCan" id="paintCan" :lineColor="lineColor ? lineColor.hex : null" :curPos="curPos" :color="color ? color.hex : null" /> -->

        <!-- Paint Pallet -->
        <BPallet />

      </div>
    </div>

    <canvas ref="render" width="420" height="420" style="display: none;" />

  </div>
</template>

<script>
import gsap from 'gsap';

// eslint-disable-next-line
import GIF from './assets/js/gif.js';
import * as WorkerGIF from '!!raw-loader!./assets/js/gif.worker';

import EventBus from './Eventbus';
import BSleeve from './components/BSleeve';
import BEvent from './components/BEvent';
import BMenu from './components/BMenu';
import BCan from './components/BCan';
import BPallet from './components/BPallet';
import BModal from './components/BModal';
import BTimeline from './components/BTimeline';

export default {
  name: 'App',
  components: {
    BCan,
    BMenu,
    BPallet,
    BEvent,
    BSleeve,
    BModal,
    BTimeline
  },
  mounted(){
    EventBus.$on('timelineToggle', () =>{
      this.timelineShow = !this.timelineShow;
    });
    EventBus.$on('clearCan', this.modalExit );
    EventBus.$on('saveGIF', this.saveGIF );
    EventBus.$on('savePNG', this.savePNG );
    EventBus.$on('loadRef', this.loadRef );
  },
  data: function(){
    return{
      timelineShow: false,
      modalOpts: null
    }
  },
  methods:{
    loadRef(){
      this.$refs.file.click();
      console.log('load click.');
    },
    modalShow(opts){
      this.modalOpts = opts;
    },
    modalExit(){
      this.$refs.menu.current = '';
      this.modalOpts = null;
    },
    savePNG(){
      const canRef = this.$refs.paintCan;
      const canLyr = canRef.$refs.can[0];
      const renderCan = this.$refs.render;
      const url = canLyr.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      window.open(url, '_blank')
    },
    saveGIF(){
      const workerStr = WorkerGIF.default;
      const blob = new Blob([workerStr], {
          type: 'application/javascript'
      });
      const gif = new GIF({
          workers: 4,
          width: 370,
          height: 360,
          workerScript: URL.createObjectURL(blob),
          quality: 3
      });

      const tLine = this.$refs.timeline;
      const canRef = this.$refs.paintCan;
      const renderCan = this.$refs.render;
      const canLyr = canRef.$refs.can[0];
      let img;

      for(let i = 0; i <= tLine.frameMax; i++){
        canRef.frameChange(i);
        img = canLyr.getContext('2d').getImageData(30,55,420,420);
        renderCan.getContext('2d').fillStyle = "#FFF";
        renderCan.getContext('2d').fillRect(0, 0, 420, 420);
        renderCan.getContext('2d').putImageData(img, 0, 0);
        gif.addFrame(renderCan, {copy: true, delay: tLine.speed*1.5});
      }

      gif.render();

      gif.on('finished', function(_gifblob){
        window.open(URL.createObjectURL(_gifblob));
      })
    },
    load(e){
      const target = e.target.files;
      const url = URL.createObjectURL(target[0])
      let delay = 0;

      this.modalExit();
      if(this.refOpen){
        delay = 1.5
        gsap.to('#refImg', 1, {top: -230});
      }

      setTimeout(() => {
        this.$refs.refImg.style.backgroundImage = "url(" + url + ")";
      }, delay * 1000);

      gsap.to('#refImg', 1, {top: 10, delay: delay});
      this.refOpen = true;
    }
  }
}
</script>

<style>
*{
  user-select: none;
  overscroll-behavior: none;
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
  #container{
    flex: 1;
    display: flex;
    flex-flow: column;
    align-items: center;
    }
    #middle{
      position: relative;
      width: 440px;
      height: 100%;
      flex: 1;
      display: flex;
      flex-flow: column;
      align-items: center;
      }
  #refImg{
    background-repeat: no-repeat;
    background-size: cover;
    width: 160px;
    height: 200px;
    position: absolute;
    right: -150px;
    z-index: 9997;
    background-color:#FFF;
    box-sizing: border-box;
    top: -230px;
    border: 2px solid;
    }
</style>
