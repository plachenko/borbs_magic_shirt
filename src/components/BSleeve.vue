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
export default {
  name: 'BSleeve',
  props: {
    curPos: {
      type: Object,
      default: function(){
        return null;
      }
    }
  },
  data: function(){
    return{

    }
  },
  methods:{

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
      left: 143px;
      top: 73px;
      background-color:#FFF;
    }

</style>
