<template>
  <div class="mainshow" style="height:100%">
    <mt-tab-container v-model="selected" style="width:100%;height:100%">
      <mt-tab-container-item id="位置" style="width:100%; min-height:100vh">

            <baidu-map class="map" 
            :center="{lng: 114.35100112284393, lat: 30.518365592201096}" 
            :zoom="18"
            :scroll-wheel-zoom="true"
            style="width:100%;height:100%;position:absolute;top:0px;bottom:0px;left:0px"
            >      
            <bm-marker 
              :position="{lng: 114.35100112284393, lat: 30.518365592201096}">
            </bm-marker>
            </baidu-map>  
      </mt-tab-container-item>
      <mt-tab-container-item id="订单">
        这里显示当前订单状态
      </mt-tab-container-item>
      <mt-tab-container-item id="我的">
        <setting></setting>
      </mt-tab-container-item>
    </mt-tab-container>

    <mt-tabbar v-model="selected">
      <mt-tab-item id="位置">
        <img slot="icon" src="../assets/100.png">
        位置
      </mt-tab-item>
      <mt-tab-item id="订单">
        <img slot="icon" src="../assets/100.png">
        订单
      </mt-tab-item>
      <mt-tab-item id="我的">
        <img slot="icon" src="../assets/100.png">
        我的
      </mt-tab-item>
    </mt-tabbar>

  </div>
</template>

<script>
import setting from './setting.vue';

export default {
  name: 'mainshow', 
  components:{
    setting
  },
  data(){
    return {
      selected:"位置",
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
