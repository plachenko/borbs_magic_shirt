<template>
  <div ref="brush" id="brush">
    <div id="magBorder" v-show="zoom"></div>
    <canvas v-show="!zoom" :class="{disabled: !color}" width="26" height="19" ref="tip" style="left: 0px; position: absolute; z-index:9989;"/>
    <canvas v-show="!zoom" id="lineTip" :style="{opacity: !lineColor ? 0 : 1}" width="26" height="19" ref="linetip" style="left: -2px; position: absolute; z-index:9988;"/>
    <img v-if="zoom" :class="{disabled: !color}" style="left: -10px; top: -20px; position: absolute; z-index: 83;" src="../assets/magnifying.png" id="tip" />
    <img v-else :class="{disabled: !color}" ref="tipBG" style="left: 0px; position: absolute;z-index: 9983;" src="../assets/tip.png" id="tip" />
    <img src="../assets/brush.png" style="left: 20px; position: absolute;" />
    <div id="sleeve" />
  </div>
</template>
<script>
import EventBus from '@/Eventbus';
export default {
  name: 'BSleeve',
  data: function(){
    return{
      zoom: false,
      sleeveDown: false,
      palletShow: false,
      tipImg: null,
      color: "000000",
      lineColor: null,
    }
  },
  methods:{
    tipChange(){
      if(!this.zoom){
        const ctxt = this.$refs.linetip.getContext('2d');
        ctxt.drawImage(this.tipImg, 0, 0);
        ctxt.fillStyle = this.lineColor ? "#"+this.lineColor : "";

        ctxt.globalCompositeOperation = "source-in";
        ctxt.fillRect(0,0,14,14);

        const ctx = this.$refs.tip.getContext('2d');
        ctx.drawImage(this.tipImg, 0, 0);
        ctx.fillStyle = this.color ? "#"+this.color : "";

        ctx.globalCompositeOperation = "source-in";
        ctx.fillRect(0,0,14,14);
      }
    },
    renderPos(_x, _y){
      const x = Math.round(_x);
      const y = Math.round(_y);

      this.$refs.brush.style.left = (x - 15) + 'px';
      this.$refs.brush.style.top = (y + 5) + 'px';

      this.$refs.brush.style.width = (window.innerWidth - x) + 'px';
    }
  },
  mounted(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    EventBus.$on('toolToggle', (e) => {
      if(e == 'Zoom'){
        this.zoom = true;
      }else if(e == 'Brush'){
        this.zoom = false;
      }
    });

    EventBus.$on('color', (c) => {
      if(c){
        this.color = c.hex;
      }else{
        this.color = null;
      }
      this.tipChange();
    });

    EventBus.$on('lineColor', (c) => {
      if(c){
        this.lineColor = c.hex;
      }else{
        this.lineColor = null;
      }
      this.tipChange();
    });
    this.$nextTick(() => {
      this.tipImg = document.getElementById('tip');
      this.tipImg.onload = () => {
        this.tipChange();
      };

      EventBus.$on('pDn', ()=>{
        if(!this.zoom){
          this.$refs.tipBG.style.top = "-4px";
          this.$refs.tipBG.style.left = "6px";
          this.$refs.tipBG.style.transform = "scaleX(-1) rotate(90deg)";

          this.$refs.linetip.style.top = "-7px";
          this.$refs.linetip.style.left = "5px";
          this.$refs.linetip.style.transform = "scaleX(-1) rotate(90deg)";

          this.$refs.tip.style.top = "-4px";
          this.$refs.tip.style.left = "6px";
          this.$refs.tip.style.transform = "scaleX(-1) rotate(90deg)";

        }
      });

      EventBus.$on('pUp', ()=>{
        if(!this.zoom){
          if(this.$refs.tipBG){
            this.$refs.tipBG.style.top = "0px";
            this.$refs.tipBG.style.left = "0px";
            this.$refs.tipBG.style.transform = "rotate(0deg)";
          }
          if(this.$refs.linetip){
            this.$refs.linetip.style.top = "-1px";
            this.$refs.linetip.style.left = "-4px";
            this.$refs.linetip.style.transform = "rotate(0deg)";
          }
          if(this.$refs.tip){
            this.$refs.tip.style.top = "0px";
            this.$refs.tip.style.left = "0px";
            this.$refs.tip.style.transform = "rotate(0deg)";
          }
        }
      });

      EventBus.$on('palletUp', () => {
        if(this.sleeveDown){
          this.$refs.brush.style.top = window.innerHeight - 80 + "px";
          this.sleeveDown = false;
        }
      });

      EventBus.$on('palletDn', () => {
        if(!this.sleeveDown){
          this.$refs.brush.style.top = window.innerHeight - 20 + "px";
          this.sleeveDown = true;
        }
      });

      EventBus.$on('palletMv', (e) => {
        this.$refs.brush.style.width = (window.innerWidth - e.clientX) + "px";

        // top = e.offsetY - 45;
        if(!this.palletShow){
          this.$refs.brush.style.transform = "scaleY(-1)"
          this.palletShow = true;
        }

        this.$refs.brush.style.top = window.innerHeight - 80 + "px";
        this.$refs.brush.style.left = e.clientX + "px";
      });

      EventBus.$on('pMv', (e)=>{
        let top = e.offsetY;
        let left = e.offsetX;

        if(this.palletShow){
          this.$refs.brush.style.transform = "scaleY(1)"
          this.palletShow = false;
        }

        if(this.zoom){
          if(e.offsetY < window.innerHeight/2 - 100){
            top = window.innerHeight/2 - 100;
          } else if(e.offsetY > window.innerHeight/2 + 85) {
            top = window.innerHeight/2 + 85;
          }
          if(e.offsetX < window.innerWidth/2 - 85){
            left = window.innerWidth/2 - 85;
          } else if(e.offsetX > window.innerWidth/2 + 120) {
            left = window.innerWidth/2 + 120;
          }
          this.renderPos(left, top);

          const posX = Math.round((left - window.innerWidth/2) + 85);
          const posY = Math.round((top - window.innerHeight/2) + 100);

          EventBus.$emit('zoomPos', {x: posX, y: posY});
          return
        }

        this.renderPos(e.offsetX, top);
      });

      EventBus.$on('resize', () => {
        this.renderPos(w/2, h/2);
      });

      this.renderPos(w/2, h/2);
    })
  }
}
</script>
<style>
  #brush{
    position: absolute;
    z-index: 9987;
    background-repeat: repeat-x;
    color:#000;
    position: absolute;
    }
    #sleeve{
      width: 100%;
      box-sizing: border-box;
      height: 40px;
      border-top: 3px solid;
      border-bottom: 3px solid;
      position: absolute;
      background: #F00;
      left: 143px;
      top: 73px;
      background-color:#FFF;
    }
    .disabled{
      opacity: .2;
    }
    #lineTip .disabled{
      opacity: 0 !important;
    }

    #magBorder{
      border: 1px solid;
      position: absolute;
      left: -90px;
      top: -90px;
      width: 180px;
      height: 180px
    }

</style>
