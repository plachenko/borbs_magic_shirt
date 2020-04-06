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
      palletShow: false,
      tipImg: null
    }
  },
  props: {
    color: {
      type: String,
      default: "000000"
    },
    lineColor: {
      type: String,
      default: "000000"
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
    this.$nextTick(() => {
      this.tipImg = document.getElementById('tip');
      this.tipImg.onload = () => {
        this.tipChange();
      };

      EventBus.$on('pDn', (e)=>{
          this.$refs.tipBG.style.top = "-4px";
          this.$refs.tipBG.style.left = "6px";
          this.$refs.tipBG.style.transform = "scaleX(-1) rotate(90deg)";

          this.$refs.linetip.style.top = "-7px";
          this.$refs.linetip.style.left = "5px";
          this.$refs.linetip.style.transform = "scaleX(-1) rotate(90deg)";

          this.$refs.tip.style.top = "-4px";
          this.$refs.tip.style.left = "6px";
          this.$refs.tip.style.transform = "scaleX(-1) rotate(90deg)";
      });

      EventBus.$on('pUp', (e)=>{
          this.$refs.tipBG.style.top = "0px";
          this.$refs.tipBG.style.left = "0px";
          this.$refs.tipBG.style.transform = "rotate(0deg)";

          this.$refs.linetip.style.top = "-1px";
          this.$refs.linetip.style.left = "-4px";
          this.$refs.linetip.style.transform = "rotate(0deg)";

          this.$refs.tip.style.top = "0px";
          this.$refs.tip.style.left = "0px";
          this.$refs.tip.style.transform = "rotate(0deg)";
      });

      EventBus.$on('pMv', (e)=>{
        let top = e.offsetY;

        if(e.offsetY > window.innerHeight - window.innerHeight/9 && !this.palletShow){
          this.palletShow = true;
          top = e.offsetY - 45;
          this.$refs.brush.style.transform = "scaleY(-1)"
        } else if(e.offsetY < window.innerHeight - window.innerHeight/9){
          top = e.offsetY
          this.$refs.brush.style.transform = "scaleY(1)"
          this.palletShow = false;
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
