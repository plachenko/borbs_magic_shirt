<template>
  <div style="position: relative;">
    <div @click="toggleColor" style="z-index: 9998; position: absolute; top: -90px; left: 30px;">
      Fill
      <div :class="{cur: selected == 'bg'}" class="colPrev">
        <span v-show="!color" class="X">X</span>
        <div :style="{backgroundColor: color ? '#'+color.hex : '#FFF'}" />
      </div>
    </div>

    <div @click="toggleLine" style="z-index: 9998; position: absolute; top: -90px; right: 30px;">
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
      selected: 'bg',
      color: new Color('000000'),
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
    this.$nextTick(() => {
      let w = window.innerWidth;

      if(w > 500){
        w = w / 2;
      }

      document.getElementById('palletImg').style.width = w + "px";
      //
    });
  }
}
</script>
<style>
.palletCol{
  min-width: 10px;
  flex:1;
  box-sizing: border-box;
  z-index: 9998;
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

</style>
