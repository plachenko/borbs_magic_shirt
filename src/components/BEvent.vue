<template>
  <div ref="cap" id="cap" />
</template>
<script>
import EventBus from '../Eventbus';
export default {
  name: 'BEvents',
  methods: {

  },
  mounted(){
    const capRef = this.$refs.cap;

    window.addEventListener('resize', (e)=>{
      EventBus.$emit('resize', e);
      // console.log(window.innerWidth, window.innerHeight);
    });

    capRef.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    capRef.addEventListener('touchstart', (e) => {
      this.md = true;
      if(e.touches.length > 1){
        e.preventDefault();
      }else{
        EventBus.$emit('pDn', e.touches[0]);
      }
    });

    capRef.addEventListener('touchend', (e) => {
      this.md = false;
      EventBus.$emit('pUp', e);
    });

    capRef.addEventListener('pointerup', (e) => {
      this.md = false;
      EventBus.$emit('pUp', e);
    });

    capRef.addEventListener('pointerdown', (e) => {
      this.md = true;
      EventBus.$emit('pDn', e);
    });

    capRef.addEventListener('pointermove', (e) => {
      EventBus.$emit('pMv', e);
      // console.log(e);
      /*
      this.$refs.brush.style.width = (window.innerWidth - e.offsetX) + 'px';
      let top = e.screenY + 'px'

      if((e.offsetX > paintPos.x - 50 && e.offsetX < paintPos.x + paintPos.width + 50) &&
        (e.offsetY > paintPos.y && e.offsetY -50 < paintPos.y + paintPos.height + 20)){
        if(this.md){
          const x = Math.round(e.offsetX - paintPos.x);
          const y = Math.round(e.offsetY - paintPos.y);
          this.curPos = {x: x, y: y};

          // HACK!
          this.$refs.tipBG.style.top = "-4px";
          this.$refs.tipBG.style.left = "6px";
          this.$refs.tipBG.style.transform = "scaleX(-1) rotate(90deg)";

          this.$refs.linetip.style.top = "-7px";
          this.$refs.linetip.style.left = "5px";
          this.$refs.linetip.style.transform = "scaleX(-1) rotate(90deg)";

          this.$refs.tip.style.top = "-4px";
          this.$refs.tip.style.left = "6px";
          this.$refs.tip.style.transform = "scaleX(-1) rotate(90deg)";
        }else{
          // HACK!
          this.$refs.tipBG.style.top = "0px";
          this.$refs.tipBG.style.left = "0px";
          this.$refs.tipBG.style.transform = "rotate(0deg)";

          this.$refs.linetip.style.top = "-1px";
          this.$refs.linetip.style.left = "-4px";
          this.$refs.linetip.style.transform = "rotate(0deg)";

          this.$refs.tip.style.top = "0px";
          this.$refs.tip.style.left = "0px";
          this.$refs.tip.style.transform = "rotate(0deg)";
          this.curPos = null;
        }
      } else {
        this.md = false;
      }

      if(e.offsetY > window.innerHeight - window.innerHeight/9 && !this.palletShow){
        this.palletShow = true;
        gsap.to('#pallet', {bottom: -5})
        top = e.offsetY - 45;
        this.$refs.brush.style.transform = "scaleY(-1)"
      } else if(e.offsetY < window.innerHeight - window.innerHeight/9){
        gsap.to('#pallet', {bottom: -65})
        top = e.offsetY
        this.$refs.brush.style.transform = "scaleY(1)"
        this.palletShow = false;
      }

      this.$refs.brush.style.top = top + 'px';
      this.$refs.brush.style.left = e.offsetX - 15 + 'px';
      */
    });
  }
}
</script>
<style>
#cap{
  position: absolute;
  left:0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 9990;
  cursor: none;
  }
</style>
