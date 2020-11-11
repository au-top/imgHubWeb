<template>
  <div class="imgElem">
    <img :src="imgUrl" :alt="imgUrl" @load.once="loadOverEvent" />
    <div class="loadBox" v-show="!loadOver">
      <div class="loadElem">
        load
      </div>
    </div>
  </div> 
</template>

<script lang="ts">
import {ref} from "vue"
export default {
  props:{
    imgUrl:{
      type:String
    },
  },
  setup(){
    const loadOver= ref(false);
    return {
      loadOver,
      loadOverEvent:()=>{
        loadOver.value=true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.imgElem{
  flex-grow: 1;
  flex-basis: 480px;
  height:280px;
  padding: 5px 10px;
  background:white;
  position: relative;
  img{
    object-fit: cover;
    width:100%;
    height:100%;   
  }
  .loadBox{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    background:#0001;
    .loadElem{
      width: 50px;
      height: 50px;
      background:#fff;
      box-shadow: 0 0 3px #0002;
      display:flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
  }
}
</style>