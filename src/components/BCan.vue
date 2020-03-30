<template>
  <div style="position: relative; height: 420px; width: 420px;">
    <!-- multiple canvases allow for a buffer layer -->
    <canvas
      v-for="(can, idx) in 2"
      :key="idx"
      width="420"
      height="420"
      ref="can" />
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
      stroke: [],
      frame: [],
      frameNum: 0,
    }
  },
  watch:{
    curPos:{
      deep: true,
      handler(point){
        this.clear(1);
        if(this.color || this.lineColor){
          this.stroke = {points: [], lineColor: this.lineColor, color: this.color}
          if(point){

            if(this.points[this.frameNum]){
              this.points[this.frameNum].push(point);
            }else{
              this.points[this.frameNum] = [point];
            }

            this.stroke.points = this.points;
            // console.log(this.stroke.points);
            this.stroke.points.forEach((pnt) => {
              pnt.forEach((p) => {
                this.$refs.can[1].getContext('2d').fillRect(p.x, p.y, 10, 10);
                // console.log(p.x);
              })
              // console.log(pnt);
            })

            // this.drawStroke(1, this.stroke.points[this.frameNum], this.color, this.lineColor);
            // this.stroke.push({points: this.points, color: this.color, lineColor: this.lineColor});
          }else{
            // pointer up.
            // this.drawStroke(0, this.points, this.color, this.lineColor);
            // console.log(this.stroke.points[this.frameNum]);
            this.drawStroke(0, this.stroke.points[this.frameNum], this.color, this.lineColor);
            this.points = [];
          }
        }
      }
    }
  },
  methods: {
    clearAll(){
      this.frames = [];
      this.strokes = [];

      for(const i in this.$refs.can){
        this.clear(i);
      }
    },
    clear(idx){
      // console.log('clearing.', idx);
      const can = this.$refs.can[idx];
      can.getContext('2d').clearRect(0, 0, can.width, can.height)
    },
    save(){
      //
    },
    drawFrame(n){
      if(this.frames[n]){
        this.frames[n].forEach((_stroke) => {
          this.draw(0, _stroke);
        })
      }
    },
    drawStroke(idx, path, col, lCol){
      const ctx = this.$refs.can[idx].getContext('2d');
      if(!idx){
        console.log(ctx);

      }

      if(lCol){
        ctx.strokeStyle = '#'+lCol;
      }

      if(col){
        ctx.fillStyle = '#'+col;
      }

      /*
      if(idx == 1){
        ctx.globalCompositeOperation = 'xor';
      }
      */

      if(path){
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach((point, i) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.lineWidth =  3;

        if(col){
          ctx.fill();
          if(!lCol){
            ctx.closePath();
          }
        }

        if(lCol){
          ctx.stroke();
        }
      }
    },
    draw(_idx, strokes){
      const ctx = this.$refs.can[_idx].getContext('2d');

      if(_idx == 0){
        this.clear(0);
      }

      // console.log(strokes);

      strokes.forEach((_stroke, idx) => {
        this.drawStroke(ctx, _idx, _stroke.stroke, _stroke.color, _stroke.lineColor);
      });
    },
    frameChange(v){
      this.clearAll();
      this.frameNum = v;
      this.drawStroke(0, this.stroke.points[this.frameNum], this.color, this.lineColor);

      if(this.points.length){
        let pt
        if(v){
          pt = this.points[this.frameNum-1][this.points];
        }else{
          pt = this.points[this.frameNum][this.points];
        }

        if(this.points[this.frameNum]){
          this.points[this.frameNum].push(pt);
        }else{
          this.points[this.frameNum] = pt;
        }
      }
    }
  },
  mounted(){
    EventBus.$on('frameChange', this.frameChange);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas{
  position: absolute;
  top: 0px;
  left: 0px;
  }
</style>
