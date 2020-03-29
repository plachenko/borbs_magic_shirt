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
  data: function(){
    return{
      stroke: [],
      strokes: [],
      frames: [],
      frameNum: 0
    }
  },
  watch:{
    curPos:{
      deep: true,
      handler(v){
        this.clearCan(1);
        if(this.color || this.lineColor){
          const strokes = {stroke: this.stroke, lineColor: this.lineColor, color: this.color};
          if(v){
            this.clearCan(1);
            strokes.stroke.push(v)
            // this.stroke.push(v);
            this.draw(1, [{stroke: this.stroke, lineColor: this.lineColor, color: this.color}]);
            /*
            if(this.frames[this.frameNum]){
              // console.log(this.frames[this.frameNum]);
              this.frames[this.frameNum].push([this.stroke]);
            }else{
              this.frames[this.frameNum] = [this.stroke];
            }
            */
            // this.frameNum++;
          }else{
            this.stroke = [];

            if(this.frames[this.frameNum]){
              this.frames[this.frameNum].push(strokes);
              this.draw(0, this.frames[this.frameNum]);
            } else {
              this.frames[this.frameNum] = [strokes]
              this.draw(0, this.frames[this.frameNum]);
            }
          }
        }
      }
    }
  },
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
  methods: {
    clearAll(){
      this.frames = [];
      this.strokes = [];
      this.clearCan(0);
    },
    clearCan(idx){
      this.colors = [];
      this.clear(this.$refs.can[idx]);
    },
    clear(can){
      can.getContext('2d').clearRect(0, 0, can.width, can.height)
    },
    save(){
      //
    },
    drawStroke(ctx, idx, path, col, lCol){
      if(lCol){
        ctx.strokeStyle = '#'+lCol;
      }

      if(col){
        ctx.fillStyle = '#'+col;
      }

      if(idx == 1){
        ctx.globalCompositeOperation = 'xor';
      }

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
        this.clearCan(0);
      }

      strokes.forEach((_stroke, idx) => {
        this.drawStroke(ctx, _idx, _stroke.stroke, _stroke.color, _stroke.lineColor);
      });
    },
    frameChange(v){
      this.frameNum = v;
      this.clearCan(0);
      if(this.frames[this.frameNum]){
        // console.log(this.frames[this.frameNum]);
        this.draw(0, this.frames[this.frameNum]);
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
