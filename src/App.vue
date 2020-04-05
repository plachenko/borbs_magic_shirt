<template>
  <div id="app">
    <!--
      =Borb's Magic Shirt=
      An HTML Canvas applcation that uses context2D to paint in time.

      Check out TomThinks on twitch to catch a borb painting stream!
      https://www.twitch.tv/tomthinks
    -->

    <!-- The Event Capture -->
    <!-- <BEvent /> -->

    <!-- Borb's shirt sleeve. -->
    <!-- <BSleeve :curPos="curPos" /> -->

    <!-- Middle Container -->
    <div id="container">
      <div id="middle">

        <BMenu />

        <!--
        <div id="canvasContainer" ref="canContainer">
          <img style="position: absolute; z-index: 9995;" src="./assets/canvas.png" />
          <BCan :frameMax="fMax" ref="paintCan" id="paintCan" :lineColor="lineColor ? lineColor.hex : null" :curPos="curPos" :color="color ? color.hex : null" />
        </div>
        -->
        <BCan />

      </div>
    </div>

    <!--
    <div id="container">
      <div id="middle">
        <div id="refImg" ref="refImg"></div>


        <div id="pallet" >
          <div @click="toggleColor" style="z-index: 9998; position: absolute; top: -5px; left: -100px;">
            Fill
            <div :class="{cur: selected == 'bg'}" class="colPrev">
              <span v-show="!color" class="X">X</span>
              <div :style="{backgroundColor: color ? '#'+color.hex : '#FFF'}" />
            </div>
          </div>

          <div @click="toggleLine" style="z-index: 9998; position: absolute; top: -5px; right: -100px;">
            Stroke
            <div :class="{cur: selected == 'line'}" class="colPrev">
              <span v-show="!lineColor" class="X">X</span>
              <div :style="{backgroundColor: lineColor ? '#'+lineColor.hex : '#FFF'}" />
            </div>
          </div>

          <div ref="pallet" style="display: flex; width: 100%; position: absolute; height: 100%;">
            <div
              class="palletCol"
              v-for="(col, idx) in colors"
              :key="idx"
              @click="changeColor(col)"
              />
          </div>
          <img src="./assets/pallet.png" ref="palletImg">
        </div>
      </div>
    </div>
    <canvas ref="render" width="420" height="420" style="display: none;" />
    -->
  </div>
</template>

<script>
/*
import BTimeline from './components/BTimeline';
import gsap from 'gsap';
import Color from './classes/Color';

// eslint-disable-next-line
import GIF from './assets/js/gif.js';
import * as WorkerGIF from '!!raw-loader!./assets/js/gif.worker';
*/

import EventBus from './Eventbus';
import BSleeve from './components/BSleeve';
import BEvent from './components/BEvent';
import BMenu from './components/BMenu';
import BCan from './components/BCan';

export default {
  name: 'App',
  components: {
    BCan,
    BMenu
    // BEvent
    // BSleeve
    // BTimeline
    // BColor
  },
  mounted(){
    EventBus.$on('pDn', (e)=>{
      // console.log(e);
    })
  }
  /*
  data: function(){
    return{
      coloring: false,
      color: new Color('000000'),
      lineColor: null,
      selected: 'bg',
      timelineShow: true,
      palletShow: false,
      refOpen: false,
      fMax: 3,
      curPos: null,
      md: false,
      tipImg: null,
      armShow: true,
      colors:[
        new Color('000000'),
        new Color('FFFFFF'),
        new Color('F2B7D6'),
        new Color('E91D3B'),
        new Color('FDBC24'),
        new Color('45B5F1'),
        new Color('A776EE'),
        new Color('58E8A4'),
        new Color('162770'),
        new Color('5A2F1C'),
        new Color('F7EB3D'),
        new Color('C7C6C7'),
        new Color('115011'),
        new Color('380E74')
      ]
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
    changeColor(val){
      if(this.selected == 'bg'){
        if(this.color){
          this.color.mix(val);
        }else{
          this.color = new Color(val.hex);
        }
      } else if(this.selected == 'line'){
        if(this.lineColor){
          this.lineColor.mix(val);
        }else{
          this.lineColor = new Color(val.hex);
        }
      }
    },
    toggleColor(){
      if(this.selected == 'bg'){
        if(this.color){
          this.color = null;
        }else{
          this.color = new Color("000000");
        }
      }
      this.selected = 'bg';
    },
    toggleLine(){
      if(this.selected == 'line'){
        if(this.lineColor){
          this.lineColor = null;
        }else{
          this.lineColor = new Color("000000");
        }
      }
      this.selected = 'line';
    },
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

    },
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
    tipChange(){
      const ctxt = this.$refs.linetip.getContext('2d');
      ctxt.drawImage(this.tipImg, 0, 0);
      ctxt.fillStyle = this.lineColor ? "#"+this.lineColor.hex : "";

      ctxt.globalCompositeOperation = "source-in";
      ctxt.fillRect(0,0,14,14);

      const ctx = this.$refs.tip.getContext('2d');
      ctx.drawImage(this.tipImg, 0, 0);
      ctx.fillStyle = this.color ? "#"+this.color.hex : "";

      ctx.globalCompositeOperation = "source-in";
      ctx.fillRect(0,0,14,14);
    }
  },
  mounted(){
    let paintPos, palletPos;
    this.$nextTick(() => {
      this.fMax = this.$refs.timeline.frameMax;
      this.tipImg = document.getElementById('tip');
      this.tipImg.onload = () => {
        this.tipChange();
      };

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
      width: 500px;
      height: 100%;
      flex: 1;
      display: flex;
      flex-flow: column;
      align-items: center;
      background-color:#F00;
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
  #canvasContainer{
    width: 442px;
    position: relative;
    height: 100%;
    margin-top: 60px;
    background-image: url('./assets/canvasBot.png');
    align-self: center;
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
      .palletCol{
        min-width: 10px;
        flex:1;
        box-sizing: border-box;
        z-index: 9998;
        }


      .colPrev{
        border: 1px solid;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
        padding: 3px;
        }
        .colPrev div{
          width: 50px;
          height: 50px;
        }
        .cur{
          border: 3px solid #F00;
        }

        .X{
          display: inline-block;
          color:#F00;
          margin-top: 5px;
          font-size: 40px;
        }
        .disabled{
          opacity: .2;
        }
        #lineTip .disabled{
          opacity: 0 !important;
        }
        */
</style>
