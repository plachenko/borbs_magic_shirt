<template>
  <div id="menu">
    <a v-for="(opt, idx) in menuItems" :key="idx" @click="opt.method">
      <div class="imgBtn" v-if="opt.name == 'Play'">
        <img v-if="playing" src="../assets/media-pause.png" alt="">
        <img v-else src="../assets/media-play.png" alt="">
      </div>
      <div class="imgBtn" v-else-if="opt.name == 'Brush'">
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
import EventBus from '../Eventbus';
export default {
  name:'BMenu',
  data: function(){
    return{
      current: '',
      playing: true,
      menuItems: [
        { name: 'Save', method:  this.save },
        { name: 'Play', method: this.playToggle },
        { name: 'Brush', method: this.testM },
        { name: 'Zoom', method: this.testM },
        { name: 'More', method: this.more }
      ]
    }
  },
  mounted(){
    const w = window.innerWidth;
    /*
    console.log(w);
    if(w < 400){
      this.menuItems.push(
        { name: 'Clear', method: this.testM },
        { name: 'Timeline', method: this.testM },
        { name: 'Load', method: this.testM },
      );
    }else{
      this.menuItems.push(
        { name: 'More', method: this.testM },
      );
    }
    */
  },
  methods:{
    more(){
      if(this.current == 'more'){
        this.$emit('modalShow', null);
        this.current = '';
      }else{
        this.current = 'more';
        const obj = {
          title: "More",
          items: [
            {name: 'Clear', method: 'clearCan'},
            {name: 'Load', method: 'loadRef'},
            {name: 'Timeline', method: 'stuff'},
            // {name: 'Pallet', method: 'stuff'},
          ]
        };
        this.$emit('modalShow', obj);
      }
    },
    save(){
      if(this.current == 'save'){
        this.$emit('modalShow', null);
        this.current = '';
      }else{
        this.current = 'save';
        const obj = {
          title: "Save",
          items: [
            /*
            {
              name: 'Output Scale',
              max: 5,
              min: .1,
              step: '.1',
              model: this.saveNum,
              type: 'number'
            },
            */
            {name: 'Save GIF', method: 'saveGIF'},
            {name: 'Save Frame to PNG', method: 'savePNG'}
          ]
        };
        this.$emit('modalShow', obj);
      }
    },
    playToggle(){
      this.playing = !this.playing;
      EventBus.$emit('playToggle');
      this.$emit('modalShow', null);
      this.current = '';
    },
    testM(){
      console.log('hi');
    }
  }
}
</script>
<style>
#menu{
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
    width: 20px !important;
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
    padding: 10px 0px !important;
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
      background-color:#CCC;
      color: #000;
      }
    #menu a:first-child{
      border-radius: 0px 0px 0px 15px;
      border-left: none;
      }
    #menu a:last-child{
      border-radius: 0px 0px 15px 0px;
      }

</style>
