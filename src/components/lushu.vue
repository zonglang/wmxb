<template>
	<div class="lushu">
		<baidu-map class="map" :center="center" :zoom="18">
		  <bml-lushu
		    @stop="reset"
		    :path="path"
		    :icon="icon"
		    :play="play"
		    :speed="speed"
		    :rotation="true">
		  </bml-lushu>
		</baidu-map>
	</div>
</template>

<script>
import {BmlLushu} from 'vue-baidu-map'
export default{
	name:"lushu",
	components:{
		BmlLushu
	},
	mounted(){
		var str=this.$route.query.pointList
		var arr=str.split("")
		arr.splice(0,1)
		arr.pop()
		str=arr.join("")
		console.log(str)
		this.path=JSON.parse(str.replace(/\\/g,""))
		// console.log(this.$route.query.pointList.replace(/\\/g,""));
	},
	data(){
		return{
		  play: true,
	      path: [],
	      icon: {
	        url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
	        size: {width: 52, height: 26},
	        opts: {anchor: {width: 27, height:13}}
	      },
	      center:{
  			"lng":114.35100112284393,
  			"lat":30.518365592201096
  		  },
  		  speed:20
		}
	},
	methods:{
		reset () {
	      this.play = false;
	      var that=this;
	      setTimeout(function(){
	      	that.play = true;
	      },1000)
	    },
	}
};
</script>

<style>
.lushu{
	width:100%;
	height: 100vh;
}
.map{
	/*height: 100vh;*/
	height:100vh;
	width:100vw;
}
</style>