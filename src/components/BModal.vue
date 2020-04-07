<template>
  <div id="modalCont">
    <div id="bg" @click="exit" />
    <div id="modalWhite">
      <h3>{{modalOpts.title}}</h3>
      <div id="modalInner">

        <div v-for="(opt, idx) in modalOpts.items" :key="idx" class="modalOpts">

          <div v-if="opt.type">
            {{opt.name}}
            <input
              v-if="opt.type == 'number'"
              :type="opt.type"
              :min="opt.min || 0"
              :max="opt.max || 100"
              :step="opt.step || 1"
              style="width: 40px;"
              :v-model='opt.model' />
          </div>

          <div v-else class="modalBtn" @click="optionEmit(opt.method)">
            {{opt.name}}
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '../Eventbus';

export default {
  name: 'BModal',
  data: function(){
    return{
      saveNum: 1
    }
  },
  props: {
    modalOpts:{
      type: Object,
      default: () =>{
        return {};
      }
    }
  },
  methods:{
    exit(){
      this.$emit('exit');
    },
    optionEmit(name){
      EventBus.$emit(name)
    }
  }
}
</script>
<style>
#modalCont{
  display: flex;
  place-items: center;
  justify-content:center;
  position: absolute;
  width: 100%;
  height: 100%;
}
#bg{
  position: absolute;
  z-index: 9998;
  background-color:rgba(0,0,0,.8);
  width: 100%;
  height: 100%;
}

#modalWhite{
  position: relative;
  background-color:#FFF;
  width: 300px;
  border-radius: 20px;
  z-index: 9999;
  /* overflow-y: scroll; */
  /* max-height: 400px; */
  }
  h3{
    position: absolute;
    top: -50px;
    left: 0px;
    width: 100%;
    text-align: center;
    color:#FFF;
  }

  #modalInner{
    /* margin: 5px 5px 5px 0px; */
    }

    .modalOpts{
      border-bottom: 2px solid;
    }
    .modalOpts div{
      text-align: center;
      padding: 20px 10px;
      }

      .modalBtn:hover{
        background-color:#000;
        color:#FFF;
      }

    .modalOpts:first-child .modalBtn{
      border-radius: 20px 20px 0px 0px;
    }

    .modalOpts:last-child{
      border-bottom: none;
    }

    .modalOpts:last-child .modalBtn{
      border-radius: 0px 0px 20px 20px;
    }

</style>
