<template>
  <div id="canvasContainer" ref="canContainer">
    <canvas
      v-for="(can, idx) in 2"
      :key="idx"
      width="420"
      height="420"
      ref="can"
      />
    <div id="canvasImg" />
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
      md: false,
      color: "000000",
      lineColor: null,
      curPos: null,
      fpnt: null,
      points: [],
      strokes: [],
      frameN: 0,
    }
  },
  watch:{
    curPos(pnt){
      this.clear(1);
      if(pnt){
        if(!this.pntDn){
          this.fpnt = Object.assign({}, pnt);
          this.pntDn = true;
        }

        if(!this.points[this.frameN]){
          this.points[this.frameN] = [this.fpnt, pnt];
        }

        this.points[this.frameN].push(pnt);
        this.draw(1, this.points[this.frameN], this.color, this.lineColor);
        /*
        const last = this.points[this.frameN - 1];
        let lastEl;

        if(last){
          lastEl = last[last.length-1];
        }else if(this.points[this.frameMax]){
          lastEl = this.points[this.frameMax][this.points.length-1];
        }

        if(this.points[this.frameN]){
          if(lastEl){
            this.points[this.frameN].push(lastEl);
          }
          this.points[this.frameN].push(pnt);
        }else{
          this.points[this.frameN] = [pnt];
          if(lastEl){
            this.points[this.frameN].unshift(lastEl);
          }
        }

        this.draw(1, this.points[this.frameN], this.color, this.lineColor);
        */
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
    renderCan(){
      const w = window.innerWidth;
      const h = window.innerHeight;
      const _h = Math.round(h/1.6);
      let _wh = _h;

      if(_wh > 412){
        _wh = 415;
      }

      document.getElementById('canvasImg').style.height = _h +"px";
      this.$refs.can.forEach((el)=>{
        el.height = _wh;
      })
      this.$refs.canContainer.style.marginTop = (window.innerHeight/2) - 250  + "px";
      this.drawStrokes();
    }
  },
  mounted(){

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
      const x = Math.round(e.offsetX - paintPos.x);
      const y = Math.round(e.offsetY - paintPos.y);

      if(this.md){
        this.curPos = {x: x, y: y};
      }else{
        this.curPos = null;
      }

    });
    EventBus.$on('frameChange', this.frameChange);
    EventBus.$on('clearCan', this.clearAll);
  }
}
</script>
<style scoped>
canvas{
  position: absolute;
  top: 0px;
  left: 0px;
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
    }
  #canvasImg{
    position: absolute;
    z-index: 9975;
    background-image: url('../assets/canvas.png');
    background-position: center top;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    min-height: 60%;
    max-height: 100%;
    }
</style>
