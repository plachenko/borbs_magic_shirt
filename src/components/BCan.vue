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
export default {
  name: 'BCan',
  data: function(){
    return{
      tool: 0,
      speed: 100,
      stroke: [],
      strokes: [],
      frameNum: 0,
      frameMax: 0,
      frames: [],
      playing: true
    }
  },
  watch:{
    color(v){
      //
    },
    curPos:{
      deep: true,
      handler(v){
        this.clearCan(1);
        if(v){
          this.stroke.push(v);
          this.draw(1, [{stroke: this.stroke, color: this.color}]);
        }else{
          this.strokes.push(this.stroke);
          this.stroke = [];
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
    color: {
      type: String,
      default: "000000"
    }
  },
  methods: {
    clearAll(){
      this.frames = [];
      this.strokes = [];
      this.clearCan(1);
    },
    clearCan(idx){
      this.colors = [];
      this.clear(this.$refs.can[idx]);
    },
    clear(can){
      can.getContext('2d').clearRect(0, 0, can.width, can.height)
    },
    save(){
      // const data = this.cans[1].can.toDataURL();
      // console.log(data);
      // this.saving = true;
      // this.cans[2].can.width = 5 * 300;
      /*
      while(i < 4){
        setTimeout(() => {
          const data = this.cans[1].can.toDataURL();
          i++;
        }, 1000)
      }
      */
    },
    draw(idx, strokes){
      const ctx = this.$refs.can[idx].getContext('2d');

      /*
      strokes.stroke.forEach((stroke, i) => {
        ctx.fillStyle = '#'+stroke.color;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, strokes[0].y);

        stroke.forEach((point, i) => {
          ctx.lineTo(point.x, point.y);
        })

        ctx.closePath();
        ctx.fill();
        // ctx.stroke();
      });
      */
      // console.log(strokes.stroke, strokes.color);
    },
    update(){
      if(this.playing){
        this.clearCan(0);
        this.frames.push({stroke: this.strokes, color: this.color});

        if(this.frames[this.frameNum]){
          this.draw(0, this.frames[this.frameNum]);
        }
        setTimeout(() => {
          window.requestAnimationFrame(this.update);
          if(this.frameNum < this.frameMax){
            this.frameNum++;
          }else{
            this.frameNum = 0;
          }
        }, this.speed);

      }
    }
  },
  mounted(){
    this.$nextTick(() => {
      window.requestAnimationFrame(this.update);

      /*
      const cap = this.$refs.cap.getBoundingClientRect()

      this.offset.x = cap.left;
      this.offset.y = cap.top;

      this.$refs.cont.style.width = this.dim.w + "px";
      this.$refs.cont.style.height = this.dim.h + "px";

      for(const can of this.$refs.can){
        can.width = this.dim.w;
        can.height = this.dim.h;
        this.cans.push({can: can, ctx: can.getContext('2d')});
      }

      this.$refs.cap.addEventListener('pointerdown', (e) => {
        console.log(this.$refs.cap.getBoundingClientRect().left);
        if(this.tool == 0){
          this.stroke.push([e.offsetX-125, e.offsetY-125]);
          this.draw([this.stroke], 0);
        }
        if(this.tool == 1 || this.sym || this.tool ==2){
          this.startPosition = {x: e.offsetX, y: e.offsetY};
        }
        if(this.sym){
          this.strokeSym.push([e.offsetX, e.offsetY]);
        }
      });

      this.$refs.cap.addEventListener('pointerup', (e) => {
        if(this.tool == 0){
          this.animFrame = 0;
          this.stroke.push([e.offsetX-125, e.offsetY-125]);
          this.frame.push(this.stroke);
          // this.frames[this.animFrame].push(this.frame);animFrame
          if(this.sym){
            this.frame.push(this.strokeSym);
            this.colors.push(this.color);
            this.strokeSym = [];
          }
          this.clear(this.cans[0]);
          this.colors.push(this.color);
          this.stroke = [];
        }
        if(this.tool == 1){
          this.startPosition = {};
        }
        this.timer = 0;
      });

      this.$refs.cap.addEventListener('pointermove', (e) => {
        const strokes = []
        if(e.pressure){
          if(this.tool == 0){
            this.timer ++;
            this.stroke.push([e.offsetX - 125, e.offsetY - 125]);
            strokes[0] = this.stroke;

/*
            /*
            let prev = this.stroke[this.timer-1];
            let cur = this.stroke[this.timer];
            let xDiff = (prev[0] - cur[0]) ** 2;
            let yDiff = (prev[1] - cur[1]) ** 2;
            let dist = Math.sqrt(xDiff + yDiff);
            */

/*
            if(this.sym){
              const x = this.startPosition.x + (this.startPosition.x - e.offsetX);
              this.strokeSym.push([x, e.offsetY]);
              strokes[1] = this.strokeSym;
            }

            this.clear(this.cans[0]);
            if(this.anim){
              this.animFrame++;
              // console.log(this.frames[this.animFrame])
              if(this.frames[this.animFrame]){
                this.frames[this.animFrame].push(this.stroke)
              }else{
                this.frames[this.animFrame] = this.stroke;
              }
            }
            this.draw(strokes, 0);
          }
          if(this.tool == 1){
            this.sym = false;
            this.move((e.offsetX - this.startPosition.x), (e.offsetY - this.startPosition.y));
            this.startPosition.x = e.offsetX;
            this.startPosition.y = e.offsetY;
            // this.move(e.offsetX - (this.startPosition.x - e.offsetX), e.offsetY - (this.startPosition.y - e.offsetY));
          }
          if(this.tool == 2){

            this.$refs.text.style.left = e.offsetX - this.startPosition.x + "px";
            this.$refs.text.style.top = e.offsetY - this.startPosition.y + "px";
          }
        }
        });

        */

      });
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
