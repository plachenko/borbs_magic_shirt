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
      firstPnt: null,
      frameNum: 0,
      frameEvt: false
    }
  },
  watch:{
    curPos:{
      deep: true,
      handler(points){
        this.clearCan(1);
        if(this.color || this.lineColor){
          if(points){
            if(this.frameEvt){
              this.stroke = [];
              console.log(this.stroke);
              this.frameEvt = false;
            }
            this.stroke.push(points);
            // if there are values in the pointer down push them into stroke...
            // this.stroke.push(v);

            // this.strokes = {stroke: this.stroke, lineColor: this.lineColor, color: this.color};

          /*
            if(this.frames[this.frameNum] && this.reset){
              this.frames[this.frameNum].push(this.strokes)
            } else {
              this.frames[this.frameNum] = [this.strokes];
              this.reset = false;
            }

            this.draw(1, this.strokes);
          }else{
            this.reset = true;
            this.stroke = [];
            this.drawFrame(this.frameNum);
          }
          */
          }else{
            this.stroke = [];
          }
        }
        /*
        this.clearCan(1);
        if(this.color || this.lineColor){
          if(v){
            this.stroke.push(v);
            this.strokes = {stroke: this.stroke, lineColor: this.lineColor, color: this.color};
            // console.log(strokes);
            // this.clearCan(1);
            // strokes.stroke.push(v)
            // this.stroke.push(v);
            this.draw(1, [this.strokes]);
            if(this.frames[this.frameNum]){
              this.frames[this.frameNum].push(this.strokes);
              // console.log(this.frames[this.frameNum]);
              // console.log('in', this.frames[this.frameNum][0].stroke);
              // this.frames[this.frameNum][0].stroke.push(v);
              // this.frames[this.frameNum].push(this.strokes);
              // this.frames[this.frameNum].push(this.stroke)
            }else{
              //
              // console.log('none');
              this.frames[this.frameNum] = [this.strokes];
            }

            // this.frameNum++;
          }else{
            // this.stroke = [];
            // this.drawFrame(this.frameNum);
            // if(this.frames[this.frameNum]){
              // this.frames[this.frameNum].push(strokes);
              // this.draw(0, this.frames[this.frameNum]);
            // } else {
              // this.frames[this.frameNum] = [strokes]
              // this.draw(0, this.frames[this.frameNum]);
            // }
          }
        }
        */
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
        // console.log(strokes);
      }

      this.drawStroke(ctx, _idx, strokes.stroke, strokes.color, strokes.lineColor);
      // strokes.forEach((_stroke, idx) => {
        // console.log(_stroke.stroke);
      // });
    },
    drawFrame(n){
      if(this.frames[n]){
        /*
        this.frames[n].forEach((_stroke) => {
          console.log(_stroke);
          this.draw(0, [_stroke]);
        })
        */
       this.draw(0, this.frames[n])
      }
      // console.log(this.frames[n]);
    },
    frameChange(v){
      this.frameNum = v;
      this.clearCan(0);
      this.clearCan(1);
      // this.stroke = [];
      this.drawFrame(v);
      this.frameEvt = true;

      // if(this.frames[this.frameNum]){
        // this.stroke = this.frames[this.frameNum].strokes;
        // this.frames[this.frameNum].forEach((_stroke) => {
          // this.draw(0, _stroke);
          // _stroke.stroke.forEach((_intern) => {
            // this.$refs.can[0].getContext('2d').fillRect(_intern.x,_intern.y,20,20);
          // })
        // })
        // console.log(this.frames[this.frameNum]);
        // this.draw(0, this.frames[this.frameNum]);
      // }
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
