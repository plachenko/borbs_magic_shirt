<template>
  <div ref="cont" id="bcan">
    <div id="toolbar" style="position: absolute; top: -20px;">
      <a href="#" @click="tool = 0">draw</a>
      <a href="#" @click="tool = 1">move</a>
      <a href="#" @click="clearCan">clear</a>
      <a href="#" @click="sym = !sym">symmetry: {{sym ? "on" : "off"}}</a>
      <a href="#" @click="save">save</a>
    </div>
    <div ref="cap" id="cap" />
    <canvas v-for="(i, idx) in 3" :key="idx" ref="can" :style="{zIndex: maxZ-idx}" />
  </div>
</template>

<script>
export default {
  name: 'BCan',
  data: function(){
    return{
      tool: 0,
      sym: false,
      speed: 100,
      maxZ: 9998,
      cans: [],
      stroke: [],
      strokeSym: [],
      frame: [],
      colors: [],
      gif: null,
      maxFrame: 9,
      curFrame: 0,
      timer: 0,
      saving: false,
      i: 0
    }
  },
  watch:{
    color(){
      this.tool = 0;
    }
  },
  props: {
    color: {
      type: String,
      default: "rgb(0,0,0)"
    },
    dim: {
      type: Object,
      default: function() {
        return{
          w: 600,
          h: 600
        }
      }
    }
  },
  methods: {
    clearCan(){
      this.frame = [];
      this.colors = [];
      this.clear(this.cans[1]);
    },
    clear(can){
      can.ctx.clearRect(0,0,can.can.width, can.can.height)
    },
    move(x= 0, y= 0){
      this.frame.forEach((stroke) => {
        this.clear(this.cans[1])
        stroke.forEach((i)=>{
          i[0] += x;
          i[1] += y;
        })
      })
    },
    save(){
      const data = this.cans[1].can.toDataURL();
      console.log(data);
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
    draw(frame, _idx){
      const ctx = this.cans[_idx].ctx
      if(frame.length){
        frame.forEach((strokes, idx) =>{
          if(_idx){
            ctx.fillStyle = this.colors[idx];
          }else{
            ctx.fillStyle = this.color;
          }

          ctx.beginPath();
          ctx.moveTo(strokes[0][0], strokes[0][1]);

          strokes.forEach((stroke) => {
            ctx.lineTo(stroke[0] + Math.round(Math.random()*3), stroke[1]+ Math.round(Math.random()*3));
          });

          // ctx.strokeStyle = "rgb(255,0,0)";
          ctx.closePath();
          ctx.fill();
          // ctx.stroke();
        });
      }
    },
    update(){
      setTimeout(() => {
        window.requestAnimationFrame(this.update);
        this.clear(this.cans[1]);
        this.draw(this.frame, 1);
        if(this.i <= 4 && this.saving){
          this.i++;
          // console.log(this.cans[2].ctx)
          this.cans[2].ctx.drawImage(this.cans[1].can, this.i*300, 0);
          // console.log(this.cans[2].can)
          if(this.i == 4){
            const data = this.cans[2].can.toDataURL();
            console.log(data);
            this.cans[2].can.width = 300;
          }
        }else{
          this.saving = false;
          this.i = 0;
        }
      }, this.speed);
    }
  },
  mounted(){
    this.$nextTick(() => {

      this.$refs.cont.style.width = this.dim.w + "px";
      this.$refs.cont.style.height = this.dim.h + "px";

      for(const can of this.$refs.can){
        can.width = this.dim.w;
        can.height = this.dim.h;
        this.cans.push({can: can, ctx: can.getContext('2d')});
      }

      this.$refs.cap.addEventListener('pointerdown', (e) => {
        if(this.tool == 0){
          this.stroke.push([e.offsetX, e.offsetY]);
          this.draw([this.stroke], 0);
        }
        if(this.tool == 1 || this.sym){
          this.startPosition = {x: e.offsetX, y: e.offsetY};
        }
        if(this.sym){
          this.strokeSym.push([e.offsetX, e.offsetY]);
        }
      });

      this.$refs.cap.addEventListener('pointerup', (e) => {
        if(this.tool == 0){
          this.stroke.push([e.offsetX, e.offsetY]);
          this.frame.push(this.stroke);
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
            this.stroke.push([e.offsetX, e.offsetY]);
            strokes[0] = this.stroke;

            /*
            let prev = this.stroke[this.timer-1];
            let cur = this.stroke[this.timer];
            let xDiff = (prev[0] - cur[0]) ** 2;
            let yDiff = (prev[1] - cur[1]) ** 2;
            let dist = Math.sqrt(xDiff + yDiff);
            */

            if(this.sym){
              const x = this.startPosition.x + (this.startPosition.x - e.offsetX);
              this.strokeSym.push([x, e.offsetY]);
              strokes[1] = this.strokeSym;
            }

            this.clear(this.cans[0]);
            this.draw(strokes, 0);
          }
          if(this.tool == 1){
            this.sym = false;
            this.move((e.offsetX - this.startPosition.x), (e.offsetY - this.startPosition.y));
            this.startPosition.x = e.offsetX;
            this.startPosition.y = e.offsetY;
            // this.move(e.offsetX - (this.startPosition.x - e.offsetX), e.offsetY - (this.startPosition.y - e.offsetY));
          }
        }
        });

        window.requestAnimationFrame(this.update);

      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #bcan{
    position: relative;
  }
  #cap{
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
  canvas{
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px solid;
  }
  #toolbar a{
    display: inline-block;
    margin: 0px 4px;
    text-decoration: none;
    user-select: none;
    border-left: 1px solid;
    padding-left: 4px;
    font-size: 10px !important;
  }
  #toolbar a:first-child{
    border:none;
  }
</style>
