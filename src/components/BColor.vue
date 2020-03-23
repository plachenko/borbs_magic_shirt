<template>
  <div id="bcol">
    <form @submit.prevent="addColor(color)">
      <fieldset>
        <legend>Color</legend>

        <div v-for="(label, idx) in labels" :key="idx" >
          <label :for="label.label"> {{label.label}} </label>
          <input :name="label.label" type="range" v-model="color[label.key]" max="255" />
          {{color[label.key]}}
        </div>
        <input type="submit" value="add" />
        <input type="submit" @click.prevent="randColor" value="random" />
      </fieldset>
    </form>
    <div id="prev" :style="{backgroundColor: formatColor(color)}"  />
    <div id="strokePrev" :style="{backgroundColor: formatColor(strokeColor)}"  />
    <div style="position: relative; clear: both; border: 1px solid; margin: 10px 3px; width: 300px; height: 220px; overflow-y: scroll; float:left;">
      <div style="margin-bottom: 10px; border-bottom: 1px solid; height: 20px; width: 100%;">
        <a style="display: inline-block; margin: 0px 10px;" href="#" @click.prevent="clearPallet">clear</a>
        <a href="#" @click.prevent="randomPallet">randomize</a>
      </div>
      <div :class="{cur: idx == activeCol}" class="color" v-for="(_color, idx) in colors" :key="idx">
        <div @click="selectCol(_color, idx)" :style="{backgroundColor: formatColor(_color)}"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BCan',
  data: function(){
    return{
      activeCol: 0,
      colors: [],
      strokeColor:{
        r: 0,
        g: 0,
        b: 0
      },
      color: {
        r: 0,
        g: 0,
        b: 0
      },
      labels: [
        {label: 'Red', key: 'r'},
        {label: 'Green', key: 'g'},
        {label: 'Blue', key: 'b'},
      ],
    }
  },
  watch:{
    color: {
      deep: true,
      immediate: true,
      handler(v){
        const _colS = this.formatColor(v);
        this.$emit('colorSelect', _colS);
      }
    }
  },
  methods: {
    selectCol: function(_color, idx){
      this.color = Object.assign({}, _color);
      this.activeCol = idx;
    },
    formatColor: function(v){
      return "rgb(" + v.r + "," + v.g + "," + v.b + ")";
    },
    addColor(col){
      const _col = Object.assign({}, col)
      this.colors.push(_col);
      this.selectCol(_col, this.colors.length-1);
    },
    randColor(){
      this.color.r = Math.round(Math.random()* 255);
      this.color.g = Math.round(Math.random()* 255);
      this.color.b = Math.round(Math.random()* 255);
    },
    clearPallet(){
      this.colors = [];
    },
    randomPallet(){
      this.colors = [];

      this.addColor({r: 0, g: 0, b: 0});
      this.addColor({r: 255, g: 255, b: 255});

      for(let i = 0; i <= 10; i++){
        this.randColor();
        this.addColor(this.color);
      }

    },
  },
  mounted(){
      this.randomPallet();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #bcol{
    position: relative;
    float: left;
    width: 300px;
    padding: 10px;
    }
    form{
      width: 250px;
      float: left;
    }
    input[type="submit"]{
      margin: 10px 2px;
    }
    label{
      float:left;
      width: 50px;
      }
      #strokePrev{
        margin-top: 8px;
        float: left;
        width: 45px;
        height: 45px;
        border: 1px solid;
      }
      #prev{
        margin-top: 8px;
        float: left;
        width: 45px;
        height: 45px;
        border: 1px solid;
      }
      .color{
        border: 1px solid;
        float: left;
        padding: 3px;
        cursor: pointer;
        margin: 3px;
        }
        .cur{
          color: #f00;
        }
        .color div{
          width: 30px;
          height: 30px;
          }
</style>
