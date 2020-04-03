<template>
  <div id="app">

    <div ref="cap" id="cap" />
    <div ref="brush" id="brush">
      <canvas :class="{disabled: !color}" width="26" height="19" ref="tip" style="left: 0px; position: absolute; z-index:9994;"/>
      <canvas id="lineTip" :style="{opacity: !lineColor ? 0 : 1}" width="26" height="19" ref="linetip" style="left: -2px; position: absolute; z-index:9993;"/>
      <img :class="{disabled: !color}" ref="tipBG" style="left: 0px; position: absolute;z-index: 9993;" src="./assets/tip.png" id="tip" />
      <img src="./assets/brush.png" style="left: 20px; position: absolute;" />
      <div id="sleeve" />
    </div>

    <div id="container">
      <div id="middle">
        <div id="refImg" ref="refImg"></div>

        <div id="menu">
          <a href="#" @click="save">Save</a>
          <a href="#" @click="$refs.paintCan[curCan-1].clearAll()">Clear</a>
          <a href="#" @click="$refs.paintCan[curCan-1].copyToNext()">Copy</a>
          <a href="#" @click="timelineShow = !timelineShow">Timeline</a>
          <!-- <a href="#" @click="camera">Camera</a> -->
          <input type="file" ref="file" @change="load" style="display:none" />
          <a href="#" @click="$refs.file.click()" style="border-radius: 0px 0px 15px 0px">Load</a>
          <BTimeline :curPos="curPos" ref="timeline" v-show="timelineShow" />
        </div>


        <div id="canvasContainer" ref="canContainer">

          <div style="position: absolute; left: -180px; top: 140px;width: 800px; height: 100px;">
            <div style="left: 30px;" v-if="curCan > 1" class="canBtn" @click="setCan(-1, curCan)">&lt;</div>
            <div style="right: 30px;" class="canBtn" @click="setCan(1, curCan)">&gt;</div>
          </div>

          <img style="position: absolute; z-index: 9995;" src="./assets/canvas.png" />
          <BCan :frameMax="fMax" class="bCanvases" v-for="(c, i) in canNum" :current="i == curCan-1" :key="i" ref="paintCan" id="paintCan" :lineColor="lineColor ? lineColor.hex : null" :curPos="curPos" :color="color ? color.hex : null" />
        </div>
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
          <!-- <canvas ref="palletCan" width="315" height="35" /> -->
          <img src="./assets/pallet.png" ref="palletImg">
        </div>
      </div>
    </div>
    <canvas ref="render" width="420" height="420" style="display: none;" />

  </div>
</template>

<script>
import BCan from './components/BCan';
import BTimeline from './components/BTimeline';
import gsap from 'gsap';
import Color from './classes/Color';

// eslint-disable-next-line
import GIF from './assets/js/gif.js';
import * as WorkerGIF from '!!raw-loader!./assets/js/gif.worker';
import EventBus from './Eventbus';

export default {
  name: 'App',
  components: {
    BCan,
    BTimeline
    // BColor
  },
  data: function(){
    return{
      maxFrameArr: [],
      curCan: 1,
      canNum: 1,
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
    frameMaxChange(v){
      this.maxFrameArr[this.curCan-1] = parseInt(v);
    },
    setCan(num, idx){
      if((num + this.curCan) > this.canNum){
        this.canNum++;
      }
      this.curCan += num;

      this.$refs.paintCan.forEach((e,idx) => {
        if(this.curCan - 1 !== idx){
          gsap.to(e.$el, .4, {autoAlpha: 0});
        }else{
          gsap.to(e.$el, .4, {autoAlpha: 1});
        }
        const maxFrame = this.maxFrameArr[this.curCan-1] >= 0 ? this.maxFrameArr[this.curCan-1] : -1 ;
        gsap.to(e.$el, {right: "+=" + num*420, onComplete: () => {
          this.$refs.timeline.frameNum = 0;
          if(this.maxFrameArr[this.curCan-1] >= 0){
            this.$refs.timeline.frameMax = this.maxFrameArr[this.curCan-1];
          }else{
            this.$refs.timeline.frameMax = 3;
          }
        }});
      });
    },
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
      const canRef = this.$refs.paintCan[this.curCan-1];
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
      paintPos = this.$refs.paintCan[this.curCan-1].$el.getBoundingClientRect()
    });

    EventBus.$on('frameMax', this.frameMaxChange);

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


    this.$refs.cap.addEventListener('pointerup', (e) => {
      this.md = false;
    });
    this.$refs.cap.addEventListener('pointerdown', (e) => {
      this.md = true;
    });

    this.$refs.cap.addEventListener('pointermove', (e) => {
      this.$refs.brush.style.width = (window.innerWidth - e.offsetX) + 'px';
      let top = e.screenY + 'px'

      if((e.offsetX > paintPos.x - 50 && e.offsetX < paintPos.x + paintPos.width + 50) &&
        (e.offsetY > paintPos.y && e.offsetY -50 < paintPos.y + paintPos.height + 20)){
        if(this.md){
          const x = Math.round(e.offsetX - paintPos.x);
          const y = Math.round(e.offsetY - paintPos.y);
          this.curPos = {x: x, y: y};

          // HACK!
          this.$refs.tipBG.style.top = "-4px";
          this.$refs.tipBG.style.left = "6px";
          this.$refs.tipBG.style.transform = "scaleX(-1) rotate(90deg)";

          this.$refs.linetip.style.top = "-7px";
          this.$refs.linetip.style.left = "5px";
          this.$refs.linetip.style.transform = "scaleX(-1) rotate(90deg)";

          this.$refs.tip.style.top = "-4px";
          this.$refs.tip.style.left = "6px";
          this.$refs.tip.style.transform = "scaleX(-1) rotate(90deg)";
        }else{
          // HACK!
          this.$refs.tipBG.style.top = "0px";
          this.$refs.tipBG.style.left = "0px";
          this.$refs.tipBG.style.transform = "rotate(0deg)";

          this.$refs.linetip.style.top = "-1px";
          this.$refs.linetip.style.left = "-4px";
          this.$refs.linetip.style.transform = "rotate(0deg)";

          this.$refs.tip.style.top = "0px";
          this.$refs.tip.style.left = "0px";
          this.$refs.tip.style.transform = "rotate(0deg)";
          this.curPos = null;
        }
      } else {
        this.md = false;
      }

      if(e.offsetY > window.innerHeight - window.innerHeight/9 && !this.palletShow){
        this.palletShow = true;
        gsap.to('#pallet', {bottom: -5})
        top = e.offsetY - 45;
        this.$refs.brush.style.transform = "scaleY(-1)"
      } else if(e.offsetY < window.innerHeight - window.innerHeight/9){
        gsap.to('#pallet', {bottom: -65})
        top = e.offsetY
        this.$refs.brush.style.transform = "scaleY(1)"
        this.palletShow = false;
      }

      this.$refs.brush.style.top = top + 'px';
      this.$refs.brush.style.left = e.offsetX - 15 + 'px';
    });
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
  #cap{
    position: absolute;
    left:0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9998;
    cursor: none;
    }
  #brush{
    position: absolute;
    z-index: 9997;
    background-repeat: repeat-x;
    color:#000;
    position: absolute;
    }
  #container{
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
    right: -120px;
    z-index: 9997;
    box-sizing: border-box;
    top: -230px;
    border: 2px solid;
    }
    #middle{
      position: relative;
      width: 500px;
      height: 100%;
      display: flex;
      flex-flow: column;
      align-items: center;
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
        /* visibility: hidden; */
        /* background-color:#F00; */
        }
        .palletCol :hover{
          /* background-color:#FF0; */
          /* visibility: visible; */
        }

    #menu{
      /* width: 300px; */
      z-index: 9998;
      position: relative;
      background-color:#FFF;
      border-radius: 0px 0px 20px 20px;
      border: 2px solid;
      border-top: none;
      z-index: 9999;
      }
      #menu a{
        display: inline-block;
        width: 70px;
        text-align: center;
        text-decoration: none;
        font-weight: bold;
        color:#000;
        border-left: 2px solid;
        padding: 10px 10px;
        }
        #menu a:hover{
          background-color:#000;
          color: #FFF;
          }
        #menu a:first-child{
          border-radius: 0px 0px 0px 15px;
          border-left: none;
          }
      #sleeve{
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        border-top: 3px solid;
        border-bottom: 3px solid;
        position: absolute;
        left: 143px;
        top: 73px;
        background-color:#FFF;
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
        .canBtn{
          top: 14px;
          font-size: 4em;
          position: absolute;
          padding: 10px;
          z-index: 9998;
          }
        .canBtn :hover{
          background-color:#000;
          color:#FFF;
        }
        .bCanvases{
          position: absolute;
        }
</style>
