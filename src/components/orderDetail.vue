<template>
	<div class="orderDetail">
		<baidu-map class="map" 
		:center="center" 
		:zoom="19"
		:scroll-wheel-zoom="true"
		>
			<!-- <bm-marker 
				:position="markerPoint"
				:icon="{url: 'http://www.zonglang.xin:8082/soul/yellowcar.png', size: {width: 100, height: 100}}"
				:offset="{width: 15, height: 15}"
				animation="BMAP_ANIMATION_BOUNCE">
			</bm-marker> -->
			<bm-overlay
			    pane="labelPane"
			    class="yellowcar"
			    @draw="draw">

			    <div>
		            <img src="http://www.zonglang.xin:8082/soul/yellowcar.png"  width="60px">
		        </div>
		  	</bm-overlay>
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
			<div><i class="el-icon-news"></i> 收货人：丁蔚</div>
			<div><i class="el-icon-mobile-phone"></i> 手机号:13163237919</div>
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
	  		sendFlag:false,
	  		returnFlag:false
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
    		if(this.carInfo.car_state == 2 && !this.sendFlag){
    			this.$message('已发送短信，等待取餐')
    			this.sendFlag = true
    		}
    		if(this.carInfo.car_state == 3 && !this.returnFlag){
    			this.$message('此次配送完成！正在返回')
    			this.returnFlag = true
    		}
    		if(this.carInfo.car_state == 1){
    			this.sendFlag = false
    			this.returnFlag = false
    		}
  		},
  		sleepTime:async function(timeout=1000){
  			return new Promise(resolve => setTimeout(resolve,timeout))
  		},
  		close(){
  			console.log("点击关闭")
			this.$router.back(-1)
  		},
  		draw ({el, BMap, map}) {
	        var point = this.markerPoint
	        const pixel = map.pointToOverlayPixel(new BMap.Point(point.lng, point.lat))
	        el.style.left = pixel.x - 30 + 'px'
	        el.style.top = pixel.y - 75 + 'px'
	    },
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
.yellowcar{
  background: rgb(100, 95, 87);
  position: absolute;
  border-radius: 50%;
}
.yellowcar:after{
  content:"";
  width:0px;
  color:black;
  position:absolute;
  left:11px;
  top:55px;
  border-left:20px solid transparent;
  border-right:20px solid transparent;
  border-top:20px solid rgb(100, 95, 87);
  border-bottom:20px solid transparent;
}
</style>