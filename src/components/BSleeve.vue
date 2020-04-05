<template>
  <div ref="brush" id="brush">
    <canvas :class="{disabled: !color}" width="26" height="19" ref="tip" style="left: 0px; position: absolute; z-index:9994;"/>
    <canvas id="lineTip" :style="{opacity: !lineColor ? 0 : 1}" width="26" height="19" ref="linetip" style="left: -2px; position: absolute; z-index:9993;"/>
    <img :class="{disabled: !color}" ref="tipBG" style="left: 0px; position: absolute;z-index: 9993;" src="../assets/tip.png" id="tip" />
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
      tipImg: null
    }
  },
  methods:{
    tipChange(){
      const ctxt = this.$refs.linetip.getContext('2d');
      ctxt.drawImage(this.tipImg, 0, 0);
      ctxt.fillStyle = this.lineColor ? "#"+this.lineColor.hex : "";

      ctxt.globalCompositeOperation = "source-in";
      ctxt.fillRect(0,0,14,14);

      const ctx = this.$refs.tip.getContext('2d');
      ctx.drawImage(this.tipImg, 0, 0);
      ctx.fillStyle = this.color ? "#"+this.color.hex : "";

      ctx.globalCompositeOperation = "source-in";
      ctx.fillRect(0,0,14,14);
    },
    renderPos(x, y){
      this.$refs.brush.style.left = x + 'px';
      this.$refs.brush.style.top = y + 'px';

      this.$refs.brush.style.width = (window.innerWidth - x) + 'px';
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.tipImg = document.getElementById('tip');
      this.tipImg.onload = () => {
        this.tipChange();
      };

      EventBus.$on('pUp', (e)=>{
        // this.$refs.brush.style.bottom = 40 + 'px';

      });

      EventBus.$on('pDn', (e)=>{
        // this.$refs.brush.style.bottom = 40 + 'px';
      });
      
      EventBus.$on('pMv', (e)=>{
        this.renderPos(e.screenX, e.screenY - 125);
      });
      this.renderPos(window.innerWidth/2, window.innerHeight/2);
    })
  }
}
</script>
<style>
  #brush{
    position: absolute;
    z-index: 9997;
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

</style>
