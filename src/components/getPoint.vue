<template>
	<div class="getPoint">
		<baidu-map 
				class="map"
				:center="center" 
  				:zoom="18"
  				:scroll-wheel-zoom="true"
          		:high-resolution="false"
          		:continuous-zoom="true"
          		@ready="getMap"
  				>
		
	     <bm-marker 
			v-for="(item,index) in pointList"
			:key="index"
			:position="item">	
		</bm-marker>

	    </baidu-map>
	</div>
</template>

<script>
export default{
	name:"getPoint",
	data(){
		return {
			map:"",
			center:{
  				"lng":114.345142,
  				"lat":30.518319
  			},
  			pointList:[]
		}
	},
	mounted(){
		this.getPoint()
	},
	methods:{
		getMap:function({map}){
			this.map = map
			this.map.addEventListener("click",(e) => {
				this.pointList.push({
					"lng":e.point.lng,
					"lat":e.point.lat
				})
				console.log(JSON.stringify(this.locationList))
			})
		},
		getPoint:function(){
			
		}
	},
	computed:{
		locationList(){
			return this.pointList.map((item) => {
				return item.lat + "," +item.lng
			})
		}
	}
}
</script>

<style scoped>
	.map{
		width: 100vw;
		height: 100vh;
	}
</style>