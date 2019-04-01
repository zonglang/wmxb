<template>
	<div class="orderDetail">
		<baidu-map class="map" 
		:center="center" 
		:zoom="19"
		:scroll-wheel-zoom="true"
		>
			<bm-marker 
				:position="markerPoint"
				:icon="{url: 'http://www.zonglang.xin:8082/soul/yellowcar.png', size: {width: 100, height: 100}}"
				:offset="{width: 15, height: 15}"
				animation="BMAP_ANIMATION_BOUNCE">
			</bm-marker>

		</baidu-map>
		
		<div class="block">
		  <el-timeline>
		    <el-timeline-item
		      v-for="(activity, index) in stepItems"
		      :key="index"
		      :icon="activity.icon"
		      :type="activity.type"
		      :color="activity.color"
		      :size="activity.size"
		      >
		      {{activity.content}}
		    </el-timeline-item>
		  </el-timeline>
		</div>
		<div class="detail">
			<div><i class="el-icon-news"></i> 收货人：郝帅鹏</div>
			<div><i class="el-icon-mobile-phone"></i> 手机号:13163236886</div>
			<div><i class="el-icon-message"></i> 验证码：1537</div>
		</div>
		<div class="close">
			<i class="el-icon-error" @click="close"></i>
		</div>
	</div>
</template>

<script>
export default{
	name:"orderDetail",
	data(){
		return {
			carInfo:{},
			carId:"",
			markerPoint:{
  				"lng":114.35100,
  				"lat":30.51836
	  		},
	  		center:{
	  			"lng":114.35100,
	  			"lat":30.51836
	  		},
		}
	},
	mounted:async function(){
		this.carId = this.$route.query.carid || "001"
		while(true){
			await this.getCarInfo()
			await this.sleepTime(200)
		}
	},
	methods:{
		getCarInfo:async function(){
    		const postData = {
    				car_id:this.carId
    			}
    		const result = await this.$http.post('http://www.zonglang.xin:3000/getCar',postData,{emulateJSON:true})
    		this.carInfo=result.body.car
    		var point = this.carInfo.location.split(",")
    		this.center.lat = this.markerPoint.lat = point[0]
    		this.center.lng = this.markerPoint.lng = point[1]
  		},
  		sleepTime:async function(timeout=1000){
  			return new Promise(resolve => setTimeout(resolve,timeout))
  		},
  		close(){
  			console.log("点击关闭")
			this.$router.back(-1)
  		}
	},
	computed:{
		stepItems(){
			var arr = [{
	          content: '订单填写',
	        }, {
	          content: '配送中',
	        }, {
	          content: '等待取餐',
	        }, {
	          content: '配送完成',
	        }]
	        var state = this.carInfo.car_state || 0
	        for(let i = 0;i < state;i++){
	        	arr[i].icon = "el-icon-success"
	        	arr[i].type = "danger"
	        }
	        arr[state].color='#0bbd87'
	        arr[state].size="large"
	        return arr
		}
	}
}
</script>


<style scoped>
*{
	padding: 0;
}
.map{
	height: 110vh
}
.block{
	position:fixed;
	left:10px;
	top:10px;
	background-color: rgba(255,255,255,0.8);	
	padding: 20px 10px 0px 10px;	
}
.detail{
	position:fixed;
	right:10px;
	bottom:10px;
	background-color: rgba(255,255,255,0.5);	
	text-align: left;
}
.detail div{
	margin:10px 20px;
}
.close{
	position:fixed;
	right:10px;
	top:20px;
	font-size: 28px;
	padding-right: 20px;
	text-align: right;
}
</style>