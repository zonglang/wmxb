<template>
  <div class="showLocation">
    <baidu-map class="map" 
		:center="center" 
		:zoom="18"
		:scroll-wheel-zoom="true"
		@ready=""
	>
		<bm-marker 
			:position="markerPoint">	
		</bm-marker>

	</baidu-map>
  </div>
</template>

<script>
export default {
  name: 'showLocation',
  mounted:async function(){
  	this.carId = this.$route.query.carid;
  	while(true){
  		await this.getCarInfo()
  		var point = this.carInfo.location.split(",")
  		console.log(point)
  		this.center.lat=this.markerPoint.lat = point[0]
  		this.center.lng=this.markerPoint.lng = point[1]
  		await this.sleepTime(1000)
  	}
  },
  data(){
  	return{
  		markerPoint:{
  			"lng":114.35100,
  			"lat":30.51836
  		},
  		center:{
  			"lng":114.35100,
  			"lat":30.51836
  		},
  		carInfo:{},
  		carId:"",
  	}
  },
  methods:{
  	sleepTime:function (time=1000){
	  		return new Promise((resolve) => {
	  			setTimeout(resolve,time)
	  		})
	},
	getCarInfo:async function(){
  		const postData = {
  				car_id:this.carId
  			}
  		const result = await this.$http.post('http://www.zonglang.xin:3000/getCar',postData,{emulateJSON:true})
  		this.carInfo=result.body.car
	},
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.showLocation{
	width:100%;
	height: 100vh;
}
.map{
	height: 100vh;
}
</style>
