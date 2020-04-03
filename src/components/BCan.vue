<template>
  <div style="position: absolute; height: 420px; width: 420px;">
    <canvas
      v-for="(can, idx) in 2"
      :key="idx"
      width="420"
      height="420"
      ref="can"
      />
  </div>
</template>
<script>
import EventBus from '../Eventbus';
export default {
  name: 'BCan',
  props: {
    frameMax:{
      type: Number,
      default: 3
    },
    current: {
      type: Boolean,
      default: false
    },
    curPos: {
      type: Object,
      default: function(){
        return null;
      }
    },
    lineColor: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: "000000"
    }
  },
  data: function(){
    return{
      points: [],
      tempPoints:[],
      strokes: [],
      frameN: 0,
      totFrames: 4,
      pntDn: false,
      canDraw: false
    }
  },
  watch:{
    current:{
      immediate: true,
      handler(v){
        this.canDraw = v;
      }
    },
    curPos(pnt){
      this.clear(1);
      if(pnt && this.canDraw){
        if(!this.points[this.frameN]){
          this.points[this.frameN] = [pnt];
        }

        this.points[this.frameN].push(pnt);
        this.draw(1, this.points[this.frameN], this.color, this.lineColor);
        /*
        const last = this.points[this.frameN - 1];
        let lastEl;
        this.tempPoints.push(pnt);

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
To
        this.pntDn = true;

        this.draw(1, this.points[this.frameN], this.color, this.lineColor);
        */
      }else{
        this.pntDn = false;
        this.strokes.push({points: this.points, col: this.color, lCol: this.lineColor});
        this.points = [];
        this.drawStrokes();
      }
    }
  },
  methods:{
    frameChange(_frameN){
      this.frameN = _frameN;
      this.clear(0);
      // this.clear(1);

      if(this.points[this.frameN]){
        this.draw(1, this.points[this.frameN], this.color, this.lineColor);
      }else{
        if(this.pntDn){
          // this.points[this.frameN] = [...this.points];
          // console.log(this.strokes);
          // this.strokes.push({points: this.points[this.frameN], col: this.color, lCol: this.lineColor});

          // this.draw(1, this.points, this.color, this.lineColor);
        }
      }

      this.drawStrokes();
    },
    clearAll(){
      this.strokes = [];

      for(const i in this.$refs.can){
        this.clear(i);
      }
    },
    clear(idx){
      const can = this.$refs.can[idx];
      can.getContext('2d').clearRect(0, 0, can.width, can.height)
    },
    copyToAll(){
      for(let i = 0; i <= this.frameMax; i++){
        this.strokes.forEach((stroke)=>{
          if(stroke.points[i-1]){
            stroke.points[i] = stroke.points[i-1];
            // this.draw(0, stroke.points[i], stroke.col, stroke.lCol);
          }
        });

      }
    },
    copyToNext(){
      this.strokes.forEach((stroke)=>{
        if(stroke.points[this.frameN-1]){
          stroke.points[this.frameN] = stroke.points[this.frameN-1];
          this.draw(0, stroke.points[this.frameN], stroke.col, stroke.lCol);
        }
      });
    },
    drawStrokes(){
      const underCan = this.$refs.can[0].getContext('2d');
      underCan.fillStyle = "#FFF";
      underCan.fillRect(0,0,this.$refs.can[0].width, this.$refs.can[0].height);

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
        if(!lCol){
          ctx.closePath();
        }
        ctx.fill();
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
    }
  },
  mounted(){
    EventBus.$on('frameChange', this.frameChange);
  }
}
</script>
<style scoped>
canvas{
  position: absolute;
  top: 0px;
  left: 0px;
  }
</style>
