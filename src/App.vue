<template>
  <div id="app">

    <div ref="cap" id="cap" />
    <div ref="brush" id="brush">
      <canvas width="26" height="19" ref="tip" style="left: 0px; position: absolute; z-index:9994;"/>
      <img ref="tipBG" style="left: 0px; position: absolute;z-index: 9993;" src="./assets/tip.png" id="tip" />
      <img src="./assets/brush.png" style="left: 25px; position: absolute;" />
      <div id="sleeve" />
    </div>

    <div id="container">
      <div id="middle">
        <div id="refImg" ref="refImg"></div>

        <div id="menu">
          <a href="#" @click="save">Save</a>
          <a href="#" @click="$refs.paintCan.clearAll()">Clear</a>
          <a href="#" @click="timelineShow = !timelineShow">Timeline</a>
          <!-- <a href="#" @click="camera">Camera</a> -->
          <input type="file" ref="file" @change="load" style="display:none" />
          <a href="#" @click="$refs.file.click()" style="border-radius: 0px 0px 15px 0px">Load</a>
          <BTimeline v-show="timelineShow" />
        </div>

        <div id="canvasContainer" ref="canContainer">
          <img style="position: absolute; z-index: 9995;" src="./assets/canvas.png" />
          <BCan ref="paintCan" id="paintCan" :lineColor="lineColor" :curPos="curPos" :color="color" />
        </div>
        <div id="pallet" >
          <div @click="toggleColor" style="z-index: 9998; position: absolute; top: -5px; left: -100px;">
            Fill
            <div :class="{cur: selected == 'bg'}" class="colPrev">
              <span v-show="!color" class="X">X</span>
              <div :style="{backgroundColor: '#'+color}" />
            </div>
          </div>

          <div @click="toggleLine" style="z-index: 9998; position: absolute; top: -5px; right: -100px;">
            Stroke
            <div :class="{cur: selected == 'line'}" class="colPrev">
              <span v-show="!lineColor" class="X">X</span>
              <div :style="{backgroundColor: '#'+lineColor}" />
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

  </div>
</template>

<script>
import BCan from './components/BCan';
import BTimeline from './components/BTimeline';
// import BColor from './components/BColor';
import gsap from 'gsap';

export default {
  name: 'App',
  components: {
    BCan,
    BTimeline
    // BColor
  },
  data: function(){
    return{
      coloring: false,
      // color: "000000",
      // color: "000000",
      color: null,
      lineColor: "000000",
      selected: 'bg',
      timelineShow: true,
      palletShow: false,
      refOpen: false,
      curPos: null,
      md: false,
      tipImg: null,
      armShow: true,
      colors:[
        '000000',
        'FFFFFF',
        'F2B7D6',
        'E91D3B',
        'FDBC24',
        '45B5F1',
        'A776EE',
        '58E8A4',
        '162770',
        '5A2F1C',
        'F7EB3D',
        'C7C6C7',
        '115011',
        '380E74'
      ]
    }
  },
  watch:{
    color(v){
      this.tipChange();
    }
  },
  methods:{
    changeColor(val){
      if(this.selected == 'bg'){
        this.color = val;
      } else if(this.selected == 'line'){
        this.lineColor = val;
      }
    },
    toggleColor(){
      if(this.selected == 'bg'){
        if(this.color){
          this.color = null;
        }else{
          this.color = "000000";
        }
      }
      this.selected = 'bg';
    },
    toggleLine(){
      if(this.selected == 'line'){
        if(this.lineColor){
          this.lineColor = null;
        }else{
          this.lineColor = "000000";
        }
      }
      this.selected = 'line';
    },
    save(){
      console.log('saving.');
    },
    camera(){
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          // video.srcObject = stream;
        })
        .catch(function (err) {
          console.log("Something went wrong!");
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
      const ctx = this.$refs.tip.getContext('2d');
      ctx.drawImage(this.tipImg, 0, 0);
      ctx.fillStyle = "#"+ this.color;

      ctx.globalCompositeOperation = "source-in";
      ctx.fillRect(0,0,14,14);
    }
  },
  mounted(){
    let paintPos, palletPos;
    this.$nextTick(() => {
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

          this.$refs.tip.style.top = "-4px";
          this.$refs.tip.style.left = "6px";
          this.$refs.tip.style.transform = "scaleX(-1) rotate(90deg)";
        }else{
          // HACK!
          this.$refs.tipBG.style.top = "0px";
          this.$refs.tipBG.style.left = "0px";
          this.$refs.tipBG.style.transform = "rotate(0deg)";

          this.$refs.tip.style.top = "0px";
          this.$refs.tip.style.left = "0px";
          this.$refs.tip.style.transform = "rotate(0deg)";
          this.curPos = null;
        }
      } else {
        this.md = false;
      }

      if(e.offsetY > window.innerHeight - 80 && !this.palletShow){
        this.palletShow = true;
        gsap.to('#pallet', {bottom: -5})
        top = e.offsetY - 45;
        this.$refs.brush.style.transform = "scaleY(-1)"
      } else if(e.offsetY < window.innerHeight - 79){
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
</style>
