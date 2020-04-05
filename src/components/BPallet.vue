<template>
  <div>
    <div @click="toggleColor" style="z-index: 9998; position: absolute; top: -5px; left: -100px;">
      Fill
      <div :class="{cur: selected == 'bg'}" class="colPrev">
        <span v-show="!color" class="X">X</span>
        <div :style="{backgroundColor: color ? '#'+color.hex : '#FFF'}" />
      </div>
    </div>

    <div @click="toggleLine" style="z-index: 9998; position: absolute; top: -5px; right: -100px;">
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
    <img src="./assets/pallet.png" ref="palletImg">
  </div>
</template>
<script>
export default {

}
</script>
<style>

</style>
