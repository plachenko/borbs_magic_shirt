<template>
  <div id="canvasContainer" ref="canContainer">
    <div style="width: 80%; display: flex; place-content: center;">
      <div id="canvasImg" />

      <canvas
        v-for="(can, idx) in 2"
        :key="idx"
        ref="can"
        />

    </div>
  </div>
</template>
<script>
import EventBus from '../Eventbus';
export default {
  name: 'BCan',
  props: {
    frameMax:{
      type: Number,
      default: 0
    },
  },
  data: function(){
    return{
      zoom: false,
      palletShow: false,
      md: false,
      color: "000000",
      lineColor: null,
      curPos: null,
      fpnt: null,
      zoomed: false,
      points: [],
      strokes: [],
      frameN: 0,
    }
  },
  watch:{
    curPos(pnt){
      this.clear(1);
      if(pnt && !this.zoom){
        if(this.palletShow){
          EventBus.$emit('palletShow', false);
        }

        if(!this.pntDn){
          this.fpnt = Object.assign({}, pnt);
          this.pntDn = true;
        }

        if(!this.points[this.frameN]){
          this.points[this.frameN] = [this.fpnt, pnt];
        }

        this.points[this.frameN].push(pnt);
        this.draw(1, this.points[this.frameN], this.color, this.lineColor);
      }else{
        this.pntDn = false;
        this.strokes.push({points: this.points, col: this.color, lCol: this.lineColor});
        this.points = [];
        this.fpnt = null;
        this.drawStrokes();
      }
    }
  },
  methods:{
    /*
    zoomChange(){
      let zoom;
      if(this.zoomed){
        this.zoomed = false;
        zoom = .5;
      }else{
        this.zoomed = true;
        zoom = 2;
      }
      this.strokes.forEach((stroke)=>{
        for(let f = 0; f <= this.frameMax; f++){
          if(stroke.points[f]){
            stroke.points[f].forEach((pnt) => {
              pnt.x = pnt.x *zoom;
              pnt.y = pnt.y *zoom;
            });
          }
        }
      })
      this.drawStrokes();
    },
    */
    frameChange(_frameN){
      this.frameN = _frameN;
      this.clear(0);
      this.clear(1);

      if(this.points[this.frameN]){
        this.draw(1, this.points[this.frameN], this.color, this.lineColor);
      }
      this.drawStrokes();
    },
    clearAll(){
      this.strokes = [];

      this.drawStrokes();
      this.clear(1);
      /*
      for(const i in this.$refs.can){
        this.clear(i);
      }
      */
    },
    clear(idx){
      const can = this.$refs.can[idx];
      can.getContext('2d').clearRect(0, 0, can.width, can.height)
    },
    copyToNext(){
      this.strokes.forEach((stroke)=>{
        if(stroke.points[this.frameN-1]){
          stroke.points[this.frameN] = stroke.points[this.frameN-1];
          this.draw(0, stroke.points[this.frameN], stroke.col, stroke.lCol);
        }
      });
    },
    drawBG(){
      const underCan = this.$refs.can[0].getContext('2d');
      underCan.fillStyle = "#FFF";
      underCan.fillRect(0,0,this.$refs.can[0].width, this.$refs.can[0].height);
    },
    drawStrokes(){
      this.drawBG();

      this.strokes.forEach((stroke)=>{
        if(stroke.points[this.frameN]){
          this.draw(0, stroke.points[this.frameN], stroke.col, stroke.lCol);
        }
      })
    },
    draw(idx, path, col, lCol){
      const ctx = this.$refs.can[idx].getContext('2d');
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if(idx == 1){
        // this.clear(1);
      }

      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((point, i) => {
        ctx.lineTo(point.x, point.y);
      });

      // if(this.points){
      //   ctx.lineTo(this.points[this.points.length-1].x, this.points[this.points.length-1].y)
      // }

      if(col){
        ctx.fillStyle = '#' + col;
        ctx.fill();
        if(!lCol){
          ctx.closePath();
        }
      }

      if(lCol){
        ctx.lineWidth =  3;
        ctx.strokeStyle = '#' + lCol;
        ctx.stroke();
      }
      /*
      path.forEach((point, i) => {
        ctx.fillRect(point.x, point.y, 10, 10);
      });
      */
    },
    zoomChange(x, y){
      // console.log(x, y);
      // console.log(this.zoomed);
      if(this.zoomed){
        this.zoomed = false;
        this.$refs.can[0].getContext('2d').scale(.5,.5);
        // this.$refs.can[0].getContext('2d').translate(-x,-y);
      }else{
        this.zoomed = true;
        this.$refs.can[0].getContext('2d').scale(2,2);
        // this.$refs.can[0].getContext('2d').translate(x,y);
      }
      this.drawStrokes();
      /*
      let zoom;
      let offsetX = 0;
      let offsetY = 0;
      if(this.zoomed){
        this.zoomed = false;
        zoom = .25;
        if(offsetX){
          offsetX = -1 * offsetX;
        }
        offsetX = 0;

        if(offsetY){
          offsetY = -1 * offsetY;
        }
        offsetY = 0;
      }else{
        this.zoomed = true;
        zoom = 4;
        offsetX = 100;
        offsetY = 100;
      }
      this.strokes.forEach((stroke)=>{
        for(let f = 0; f <= this.frameMax; f++){
          if(stroke.points[f]){
            stroke.points[f].forEach((pnt) => {
              pnt.x = Math.round(pnt.x *zoom) + offsetX;
              pnt.y = Math.round(pnt.y *zoom) + offsetY;
            });
          }
        }
      })
      this.drawStrokes();
      */
    },
    renderCan(){
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.w = w;
      this.h = h;
      const _h = Math.round(h/1.6);
      let _wh = _h;

      if(_wh > 412){
        _wh = 415;
      }

      const canImg = document.getElementById('canvasImg');

      if(w <= 360){
        this.$refs.canContainer.style.marginTop = (h/2) - 250  + "px";
        canImg.style.width = "80%";
        canImg.style.height = "450px";
      }else{
        this.$refs.canContainer.style.marginTop = (h/2) - 280  + "px";
        canImg.style.width = "100%";
        canImg.style.height = "450px";
      }

      this.$refs.can.forEach((el)=>{
        if(w <= 360){
          el.style.top = "40px";
          el.width = 315;
          el.height = 300;
        }else{
          el.style.top = "52px";
          el.width = 396;
          el.height = 380;
        }
      });

      this.drawStrokes();
    }
  },
  mounted(){
    const w = window.innerWidth;

    EventBus.$on('palletShown', (v) => {
      this.palletShow = v;
    });

    EventBus.$on('color', (c) => {
      if(c){
        this.color = c.hex;
      }else{
        this.color = null;
      }
    });

    EventBus.$on('lineColor', (c) => {
      if(c){
        this.lineColor = c.hex;
      }else{
        this.lineColor = null;
      }
    });

    this.$nextTick(() => {
      this.renderCan();
      this.drawBG();
    });

    EventBus.$on('resize', this.renderCan);

    EventBus.$on('pDn', (e) => {
      let x, y;
      const cont = document.getElementById('canvasContainer');
      const paintPos = cont.getBoundingClientRect();
      if(this.zoom){
        if(w <= 360){
          x = Math.round(e.offsetX - paintPos.x) - 65;
          y = Math.round(e.offsetY - paintPos.y) - 40;
        }else{
          x = Math.round(e.offsetX - paintPos.x) - 25;
          y = Math.round(e.offsetY - paintPos.y) - 55;
        }
        this.zoomChange(x, y);
      }
      this.md = true;
    });

    EventBus.$on('pUp', (e) => {
      this.md = false;
      if(e.touches){
        this.pntDn = false;
        this.strokes.push({points: this.points, col: this.color, lCol: this.lineColor});
        this.points = [];
        this.fpnt = null;
        this.drawStrokes();
      }
    });

    EventBus.$on('pMv', (e) => {
      const cont = document.getElementById('canvasContainer');
      const paintPos = cont.getBoundingClientRect();
      let x, y;

      if(w <= 360){
        x = Math.round(e.offsetX - paintPos.x) - 65;
        y = Math.round(e.offsetY - paintPos.y) - 40;
      }else{
        x = Math.round(e.offsetX - paintPos.x) - 25;
        y = Math.round(e.offsetY - paintPos.y) - 55;
      }

      if(this.md){
        this.curPos = {x: x, y: y};
      }else{
        this.curPos = null;
      }

    });
    EventBus.$on('frameChange', this.frameChange);
    EventBus.$on('clearCan', this.clearAll);
    EventBus.$on('toolToggle', (tool) => {
      if(tool == 'Zoom'){
        this.zoom = true;
      }else{
        this.zoom = false;
      }
    });
  }
}
</script>
<style scoped>
canvas{
  position: absolute;
  /* top: 40px; */
  /* left: 45px; */
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  }

  #canvasContainer{
    width: 440px;
    position: relative;
    height: 100%;
    background-size: 385px 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../assets/canvasBot.png');
    align-self: center;
    display: flex;
    place-content: center;
    }
  #canvasImg{
    position: absolute;
    z-index: 9975;
    background-image: url('../assets/canvas.png');
    background-position: center top;
    background-repeat: no-repeat;
    background-size: contain;
    /* min-height: 60%; */
    /* max-height: 100%; */
    }
</style>
