<template>
  <div id="menu">
    <a v-for="(opt, idx) in menuItems" :key="idx" @click="opt.method">
      <div class="imgBtn" v-if="opt.name == 'Play'">
        <img v-if="playing" src="../assets/media-pause.png" alt="">
        <img v-else src="../assets/media-play.png" alt="">
      </div>
      <div class="imgBtn" v-else-if="opt.name == 'Brush' || opt.name == 'Zoom'">
        <img v-if="opt.name == 'Brush'" src="../assets/brushIcon.png" alt="">
        <img v-else-if="opt.name == 'Zoom'" src="../assets/magIcon.png" alt="">
      </div>
      <div class="imgBtn" v-else-if="opt.name == 'Timeline'">
        <img src="../assets/clockIcon.png" alt="">
      </div>
      <span style="display: inline-block; height: 10px; width: 70px;" v-else>{{opt.name}}</span>
    </a>
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
        { name: 'Zoom', method: this.toolToggle },
        { name: 'Timeline', method: this.timelineToggle },
        { name: 'More', method: this.more }
      ]
    }
  },
  mounted(){

    EventBus.$on('toolToggle', (e)=>{
      switch(e){
        case 'Brush':
          this.menuItems[2].name = "Zoom"
          break;
        case 'Zoom':
          this.menuItems[2].name = "Brush"
          break;
      }
    });

    /*
    const w = window.innerWidth;
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
            {name: 'Fullscreen', method: 'fsToggle'},
            {name: 'View Source / Report Bug', method: 'ghLink'},
            // {name: 'Pallet', method: 'stuff'},
          ]
        };

        //temporary Hack to stop from confusion of loading image on smaller devices
        if(window.innerWidth > 450){
          obj.items.unshift({name: 'Load', method: 'loadRef'});
        }
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
    timelineToggle(){
      EventBus.$emit('timelineToggle');
    },
    playToggle(){
      this.playing = !this.playing;
      EventBus.$emit('playToggle');
      // this.$emit('modalShow', null);
      // this.current = '';
    },
    toolToggle(){
      this.$emit('modalShow', null);
      this.current = '';
      if(this.menuItems[2].name == "Zoom"){
        this.menuItems[2].name = "Brush"
        EventBus.$emit('toolToggle', 'Zoom');
      }else{
        this.menuItems[2].name = "Zoom"
        EventBus.$emit('toolToggle', 'Brush');
      }
    },
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
