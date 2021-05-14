<template>
  <div id="app">
    <!--
      =Borb's Magic Shirt=
      An HTML Canvas applcation that uses context2D to paint in time.

      Check out TomThinks on twitch to catch a borb painting stream!
      https://www.twitch.tv/tomthinks
    -->

    <!-- Modal that appears for extras -->
    <BModal :modalOpts="modalOpts" :strokeNum="$refs.paintCan.strokes.length" v-if="modalOpts" @exit="modalExit" />

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
        <BCan ref="paintCan" @strokeEvt="saveStrokes" />
        <!-- <BCan :frameMax="fMax" ref="paintCan" id="paintCan" :lineColor="lineColor ? lineColor.hex : null" :curPos="curPos" :color="color ? color.hex : null" /> -->

        <!-- Paint Pallet -->
        <BPallet />

      </div>
    </div>

    <canvas ref="render" style="display: none;" />

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

    if(localStorage.getItem('strokes')){
      this.loadStrokes();
    }

    EventBus.$on('timelineToggle', () =>{
      this.timelineShow = !this.timelineShow;
    });
    EventBus.$on('clearCan', this.modalExit );
    EventBus.$on('saveGIF', this.saveGIF );
    EventBus.$on('savePNG', this.savePNG );
    EventBus.$on('loadRef', this.loadRef );
    EventBus.$on('ghLink', () => {
      window.open('https://www.github.com/plachenko/borbs_magic_shirt');
    })
    EventBus.$on('ghLink2', () => {
      window.open('https://www.github.com/plachenko/borbs_magic_shirt/issues');
    })
    EventBus.$on('fsToggle', () =>{
      if(this.fs){
        this.fs = false;
        document.exitFullscreen();
      }else{
        this.fs = true
        document.getElementById('app').requestFullscreen();
      }
    });
  },
  data: function(){
    return{
      fs: false,
      timelineShow: false,
      modalOpts: null
    }
  },
  methods:{
    loadStrokes(){
      const canRef = this.$refs.paintCan;
      const lsStrokes = localStorage.getItem('strokes')
      canRef.strokes = JSON.parse(lsStrokes || '{}');
    },
    saveStrokes(){
      const canRef = this.$refs.paintCan;
      localStorage.setItem('strokes', JSON.stringify(canRef.strokes));
    },
    loadRef(){
      this.$refs.file.click();
    },
    modalShow(opts){
      const canRef = this.$refs.paintCan;

      if(canRef.zoomed && opts){
        canRef.zoomChange();
      }

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

      const img = canLyr.getContext('2d').getImageData(10,10,canLyr.width,canLyr.height-10);
      renderCan.width = canLyr.width - 20;
      renderCan.height = canLyr.height - 30;
      renderCan.getContext('2d').fillStyle = "#FFF";
      renderCan.getContext('2d').fillRect(0, 0, 420, 420);
      renderCan.getContext('2d').putImageData(img, 0, 0);

      const url = renderCan.toDataURL('image/png');
      let fURL;
      fetch(url)
      .then(res => res.blob())
      .then( blob => {
        fURL = URL.createObjectURL(blob);
        window.open(fURL)
      });
    },
    saveGIF(){
      const workerStr = WorkerGIF.default;
      const blob = new Blob([workerStr], {
          type: 'application/javascript'
      });

      const tLine = this.$refs.timeline;
      const canRef = this.$refs.paintCan;
      const renderCan = this.$refs.render;
      const canLyr = canRef.$refs.can[0];
      let img;

      renderCan.width = canLyr.width - 10;
      renderCan.height = canLyr.height - 10;

      // If zoomed zoom out for the gif capture first.
      if(canRef.zoomSize > 1){
        canRef.zoomChange();
      }

      const gif = new GIF({
          workers: 4,
          width: renderCan.width,
          height: renderCan.height,
          workerScript: URL.createObjectURL(blob),
          quality: 3
      });

      for(let i = 0; i <= tLine.frameMax; i++){
        canRef.frameChange(i);
        img = canLyr.getContext('2d').getImageData(30,15,canLyr.width,canLyr.height-10);
        renderCan.getContext('2d').fillStyle = "#FFF";
        renderCan.getContext('2d').fillRect(0, 0, 420, 420);
        renderCan.getContext('2d').putImageData(img, 0, 0);
        gif.addFrame(canLyr, {copy: true, delay: tLine.speed*1.5});
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
  background-color:#FFF;
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
