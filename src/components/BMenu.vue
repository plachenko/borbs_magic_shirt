<template>
  <div id="menu">
    <a v-for="(opt, idx) in menuItems" :key="idx" @click="opt.method">
      <div class="imgBtn" v-if="opt.name == 'Brush'">
        <img  src="../assets/tip.png" alt="">
      </div>
      <div class="imgBtn" v-else-if="opt.name == 'Zoom'">
        <img src="../assets/magnifying.png" alt="">
      </div>
      <span style="display: inline-block; height: 10px; width: 70px;" v-else>{{opt.name}}</span>
    </a>
    <!--
    <div id="menu">
      <a href="#" @click="save">Save</a>
      <a href="#" @click="$refs.paintCan.clearAll()">Clear</a>
      <a href="#" @click="timelineShow = !timelineShow">Timeline</a>
      <input type="file" ref="file" @change="load" style="display:none" />
      <a href="#" @click="$refs.file.click()" style="border-radius: 0px 0px 15px 0px">Load</a>
      <BTimeline :curPos="curPos" ref="timeline" v-show="timelineShow" />
    </div>
    -->
  </div>
</template>
<script>
export default {
  name:'BMenu',
  data: function(){
    return{
      menuItems: [
        { name: 'Save', method: this.testM },
        { name: 'Brush', method: this.testM },
        { name: 'Zoom', method: this.testM },
        { name: 'Load', method: this.testM },
      ]
    }
  },
  methods:{
    testM(){
      console.log('hi');
    }
  }
}
</script>
<style>
#menu{
  z-index: 9998;
  position: relative;
  background-color:#FFF;
  border-radius: 0px 0px 20px 20px;
  border: 2px solid;
  border-top: none;
  z-index: 9999;
  /* margin-top: -6px; */
  }
  #menu img{
    height: 20px;
    width: 20px;
    position: absolute;
    top: 8px;
    left: 15px;
  }
  #menu .imgBtn{
    width: 30px;
    /* height: 30px; */
    }
  #menu .imgBtn div{
    height: 30px;
    padding: 10px 0px;
    }
  #menu a{
    position:relative;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    color:#000;
    border-left: 2px solid;
    padding: 10px 10px;
    vertical-align: bottom;
    height: 20px;
    }
    #menu a:hover{
      background-color:#000;
      color: #FFF;
      }
    #menu a:first-child{
      border-radius: 0px 0px 0px 15px;
      border-left: none;
      }
    #menu a:last-child{
      border-radius: 0px 0px 15px 0px;
      }

</style>
