<template>
  <div id="palletContainer" v-if="!zoom">
    <!--
    <div style="position: relative; place-content: center; display:flex; height: 30px;">
      <div id="palletToggle" @click="showPallet" />
    </div>
    -->

    <div class="preview" @click="toggleColor" id="fillPrev">
      Fill
      <div :class="{cur: selected == 'bg'}" class="colPrev">
        <span v-show="!color" class="X">X</span>
        <div :style="{backgroundColor: color ? '#'+color.hex : '#FFF'}" />
      </div>
    </div>

    <div class="preview" @click="toggleLine" id="linePrev">
      Stroke
      <div :class="{cur: selected == 'line'}" class="colPrev">
        <span v-show="!lineColor" class="X">X</span>
        <div :style="{backgroundColor: lineColor ? '#'+lineColor.hex : '#FFF'}" />
      </div>
    </div>

    <div ref="pallet" style="display: flex; width: 100%; position: absolute; height: 100%;">
      <div
        class="palletCol"
        v-for="(col, idx) in colors"
        :key="idx"
        @click="changeColor(col)"
        />
    </div>
    <img id="palletImg" style="width: 360px; vertical-align:bottom;" src="../assets/pallet.png" ref="palletImg">
  </div>
</template>
<script>
import gsap from 'gsap';
import Color from '../classes/Color';
import EventBus from '../Eventbus';
export default {
  name: 'BPallet',
  /*
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
  */
  data: function(){
    return{
      zoom: false,
      selected: 'bg',
      color: new Color('000000'),
      palletShow: true,
      lineColor: null,
      colors:[
        new Color('000000'),
        new Color('FFFFFF'),
        new Color('F2B7D6'),
        new Color('E91D3B'),
        new Color('FDBC24'),
        new Color('45B5F1'),
        new Color('A776EE'),
        new Color('58E8A4'),
        new Color('162770'),
        new Color('5A2F1C'),
        new Color('F7EB3D'),
        new Color('C7C6C7'),
        new Color('115011'),
        new Color('380E74')
      ]
    }
  },
  methods:{
    changeColor(val){
      if(this.selected == 'bg'){
        if(this.color){
          this.color.mix(val);
        }else{
          this.color = new Color(val.hex);
        }
        EventBus.$emit('color', this.color);
      } else if(this.selected == 'line'){
        if(this.lineColor){
          this.lineColor.mix(val);
        }else{
          this.lineColor = new Color(val.hex);
        }
        EventBus.$emit('lineColor', this.lineColor);
      }
    },
    hidePallet(){
      gsap.to('#palletToggle', {autoAlpha: 1});
      gsap.to('.preview', {autoAlpha: 0});
      gsap.to('#palletContainer', {bottom: -50, onComplete:() => {
        EventBus.$emit('palletShown', false);
      }});
    },
    showPallet(){
      gsap.to('#palletToggle', {autoAlpha: 0});
      gsap.to('.preview', {autoAlpha: 1});
      gsap.to('#palletContainer', {bottom: 0, onComplete: () => {
        EventBus.$emit('palletShown', true);
      }});
    },
    toggleColor(){
      if(this.selected == 'bg'){
        if(this.color){
          this.color = null;
        }else{
          this.color = new Color("000000");
        }
        EventBus.$emit('color', this.color);
      }
      this.selected = 'bg';
    },
    toggleLine(){
      if(this.selected == 'line'){
        if(this.lineColor){
          this.lineColor = null;
        }else{
          this.lineColor = new Color("000000");
        }
        EventBus.$emit('lineColor', this.lineColor);
      }
      this.selected = 'line';
    },

  },
  mounted(){
    this.$refs.pallet.addEventListener('pointerup', (e) => {
      EventBus.$emit('palletUp', e);
    });
    this.$refs.pallet.addEventListener('pointerdown', (e) => {
      EventBus.$emit('palletDn', e);
    });
    this.$refs.pallet.addEventListener('pointermove', (e) => {
      EventBus.$emit('palletMv', e);
    });
    EventBus.$on('toolToggle', (tool) => {
      if(tool == 'Zoom'){
        this.zoom = true;
      }else{
        this.zoom = false;
      }
    });
    EventBus.$on('palletShow', (v) => {
      if(v && !this.palletShow){
        this.palletShow = true;
        this.showPallet();
      }else{
        this.palletShow = false;
        this.hidePallet();
      }
    })
    this.$nextTick(() => {
      let w = window.innerWidth;

      if(w > 500){
        w = 500;
      }else{
        document.getElementById('linePrev').style.top = "-100px";
        document.getElementById('fillPrev').style.top = "-100px";
        document.getElementById('linePrev').style.right = "30px";
        document.getElementById('fillPrev').style.left = "30px";
      }

      document.getElementById('palletImg').style.width = w + "px";
      //
    });
  }
}
</script>
<style>
#palletContainer{
  position: absolute;
  /* bottom: -50px; */
  bottom: 0px;
}

.palletCol{
  min-width: 10px;
  flex:1;
  box-sizing: border-box;
  z-index: 9991;
  }


.colPrev{
  border: 1px solid;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  padding: 3px;
  }
  .colPrev div{
    width: 50px;
    height: 50px;
  }
  .cur{
    border: 3px solid #F00;
  }

  .X{
    position: absolute;
    display: inline-block;
    color:#F00;
    margin-top: 5px;
    left: 15px;
    font-size: 40px;
  }

  #palletToggle{
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color:#FFF;
    background-image: url('../assets/palletIcon.jpg');
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    position: absolute;
    top: -30px;
    border: 2px solid;
    z-index: 9991;
    cursor: pointer;
  }
  .preview{
    /* opacity: 0; */
  }
  #fillPrev{
    z-index: 9991;
    position: absolute;
    top: -35px;
    left: -70px;
  }
  #linePrev{
    z-index: 9991;
    position: absolute;
    top: -35px;
    right: -70px;
  }
</style>
