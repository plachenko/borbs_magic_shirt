<template>
  <div id="app">
    <!--
      =Borb's Magic Shirt=
      An HTML Canvas applcation that uses context2D to paint in time.

      Check out TomThinks on twitch to catch a borb painting stream!
      https://www.twitch.tv/tomthinks
    -->

    <!-- The Event Capture -->
    <BEvent />

    <!-- Borb's shirt sleeve. -->
    <BSleeve />

    <!-- Middle Container -->
    <div id="container">
      <div id="middle">
        <!-- Reference Image that loads -->
        <!-- <div id="refImg" ref="refImg"></div> -->

        <!-- Menu items. -->
        <BMenu />

        <!-- Paint Canvas -->
        <BCan />
        <!-- <BCan :frameMax="fMax" ref="paintCan" id="paintCan" :lineColor="lineColor ? lineColor.hex : null" :curPos="curPos" :color="color ? color.hex : null" /> -->

        <!-- Paint Pallet -->
        <BPallet />

      </div>
    </div>

  </div>
</template>

<script>
// import gsap from 'gsap';

// eslint-disable-next-line
import GIF from './assets/js/gif.js';
import * as WorkerGIF from '!!raw-loader!./assets/js/gif.worker';

import EventBus from './Eventbus';
import BSleeve from './components/BSleeve';
import BEvent from './components/BEvent';
import BMenu from './components/BMenu';
import BCan from './components/BCan';
import BPallet from './components/BPallet';

export default {
  name: 'App',
  components: {
    BCan,
    BMenu,
    BPallet,
    BEvent,
    BSleeve
  },
  mounted(){
    EventBus.$on('pDn', (e)=>{
      // console.log(e);
    })
  },
  methods:{
    save(){
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
    }
  }
  /*
  data: function(){
    return{
      coloring: false,
      timelineShow: true,
      palletShow: false,
      refOpen: false,
      fMax: 3,
      curPos: null,
      md: false,
      armShow: true,
    }
  },
  watch:{
    color:{
      deep:true,
      handler(){
        this.tipChange();
      }
    },
    lineColor:{
      deep:true,
      handler(){
        this.tipChange();
      }
    }
  },
  methods:{
    camera(){
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          // video.srcObject = stream;
        })
        .catch(function (err) {
          //
        });
      }
    },
    load(e){
      const target = e.target.files;
      const url = URL.createObjectURL(target[0])
      let delay = 0;

      if(this.refOpen){
        delay = 1.5
        gsap.to('#refImg', 1, {top: -230});
      }

      setTimeout(() => {
        this.$refs.refImg.style.backgroundImage = "url(" + url + ")";
      }, delay * 1000);

      gsap.to('#refImg', 1, {top: 10, delay: delay});
      this.refOpen = true;
    },
  },
  mounted(){
    let paintPos, palletPos;
    this.$nextTick(() => {
      this.fMax = this.$refs.timeline.frameMax;


      this.$refs.canContainer.style.marginTop = (window.innerHeight/2) - 250  + "px";
      paintPos = this.$refs.paintCan.$el.getBoundingClientRect()
    });

    this.$refs.pallet.addEventListener('pointerdown', (e) => {
      this.$refs.brush.style.bottom = 40 + 'px';
    });
    this.$refs.pallet.addEventListener('pointerup', (e) => {
      this.$refs.brush.style.bottom = 75 + 'px';
    });
    this.$refs.pallet.addEventListener('pointermove', (e) => {
      this.$refs.brush.style.width = (window.innerWidth - e.screenX) + 'px';
      if(!e.pressure){
        this.$refs.brush.style.left = e.screenX - 8 + 'px';
        // this.$refs.brush.style.bottom = (Math.sin(e.screenX / 100 ) * -80) + 74 + 'px';
      }
    });

  }
*/
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
/*
  #refImg{
    background-repeat: no-repeat;
    background-size: cover;
    width: 160px;
    height: 200px;
    position: absolute;
    right: -120px;
    z-index: 9997;
    box-sizing: border-box;
    top: -230px;
    border: 2px solid;
    }

    #paintCan{
      background-color:#FFF;
      position: absolute;
      }
    #pallet{
      background-color: #FFF;
      position: absolute;
      bottom: -50px;
      }
        .disabled{
          opacity: .2;
        }
        #lineTip .disabled{
          opacity: 0 !important;
        }
        */
</style>
