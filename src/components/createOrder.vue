<template>	
	<div id="createOrder">
		<!-- 小哥要录入信息 -->
		<h1 class="title">填写订单信息</h1>
		<!-- 以order为单位填写信息 -->
		<!-- 表单内容有： -->
		<el-form ref="form" :model="form" label-width="60px">
			<el-form-item label="手机号">
		    	<el-input v-model="form.phoneNumber"></el-input>
		  	</el-form-item>
			<span>地址</span>
	  		<baidu-map :center="center" 
		  				:zoom="18"
		  				:scroll-wheel-zoom="true"
		          		:high-resolution="false"
		          		@ready="getMap"
		          		@moving="moving"
		          		class="map">

				<!-- 自定义的标记点 -->
		        <bm-marker 
			  	  	:position="markerPoint"
			  	  	:dragging="false"
			  	  	:massClear="false"
			  	  	>
			  	</bm-marker>
				
				<!-- 查找控件 -->
		    	<bm-control :offset="{width: '100px', height: '100px'}">
			  	    <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 1}">
			  	      <el-input ref="searchInput" v-model="keyword" placeholder="请输入搜索内容" clearable></el-input>
			  	    </bm-auto-complete>
		  	 	</bm-control>
		  	 	<bm-local-search 
				  	  	:keyword="keyword" 
				  	  	:auto-viewport="true" 
				  	  	:panel="false" 
				  	  	@markersset="getResultPosition"
				  	  	>	
		  	  	</bm-local-search>
		  	  	<el-button type="primary" @click="onSubmit">打开箱门</el-button>
      		</baidu-map>

		</el-form>
		<!-- 手机号 -->
		<!-- 地址 -->
		<!-- 开箱按钮 -->

		<!-- 手机号 -->
		<!-- 地址 -->
		<!-- 开箱按钮 -->

	</div>
</template>

<script>
export default{
	name: 'createOrder',
	mounted:async function(){
		// 页面传入信息为小哥的id
		//获取小车信息
		await this.getCarInfo()
		//确定箱门id
		this.confirmBoxId()

	},
	data(){
		return{
			form:{
				phoneNumber:"",
				startPoint:"",
				endPoint:"",
				boxId:"",
				code:""
			},
			center:{
	  			"lng":114.35100,
	  			"lat":30.51836
  			},
  			markerPoint:{
  				"lng":114.35100,
  				"lat":30.51836
  			},
  			map:"",
  			creatorId:"1",
  			carId:"001",
  			carInfo:{},
  			forms:[],
  			keyword:""
		}
	},
	methods:{
		getResultPosition(res){
	  		console.log(res)
	  		//首先去除所有函数自己画的标志
	  		console.log("function:clearAllMarkers")
	  		var allOverlay = this.map.getOverlays();
	        for (var i = 0; i < allOverlay.length; i++){  
				console.log(allOverlay[i])
				if(allOverlay[i].point)
					if(allOverlay[i].point.lng===this.markerPoint.lng && allOverlay[i].point.lat===this.markerPoint.lat)
						continue;
	            this.map.removeOverlay(allOverlay[i]);       
	        }
			//画标识点
	  		this.markerPoint.lng=this.center.lng=res[0].point.lng;
	  		this.markerPoint.lat=this.center.lat=res[0].point.lat;
  		},
  		//获取map对象
  		getMap({map}){
	  		this.map = map;
	  		console.log(this.map)
	  	},
	  	//当地图移动时触发的函数
	  	moving(){
	  		this.markerPoint.lng = this.map.getCenter().lng;
  			this.markerPoint.lat = this.map.getCenter().lat;
	  	},
	  	//点击事件
	  	onSubmit:async function() {
	  		var _this = this
	  		//控制小车打开箱门
	  		const operation=`'{"name":"open","id":${this.form.boxId}}'`
	  		const loading1 = this.$loading({
	          lock: true,
	          text: '正在打开箱门',
	          spinner: 'el-icon-loading',
	          background: 'rgba(0, 0, 0, 0.7)'
	        });
	  		await this.updateCarOperation(operation)
	  		while(true){
	  			await this.sleepTime(1000)
	  			await this.getCarInfo()
	  			const open_state = eval(this.carInfo.open_state)
	  			if(open_state[this.form.boxId]==1){
	  				await loading1.close()
	  				break
	  			}
	  		}
	  		this.$message('箱门已打开,请放入物品，关闭箱门');
	  		const loading2 = this.$loading({
	          lock: true,
	          text: '请关闭箱门',
	          spinner: 'el-icon-loading',
	          background: 'rgba(0, 0, 0, 0.7)'
	        });
	        while(true){
	        	await this.sleepTime(1000)
	  			await this.getCarInfo()
	  			const open_state = eval(this.carInfo.open_state)
	  			if(open_state[this.form.boxId]==0){
	  				await loading2.close()
	  				break
	  			}
	  		}
	  		this.form.startPoint=this.carInfo.location
	  		this.form.endPoint=`${this.markerPoint.lat},${this.markerPoint.lng}`
	  		this.form.code = "1234"

	  		this.$message('箱门已关闭');
	  		//创建订单
	  		const orderId = await this.createOrder()
	  		//将订单添加进数据库
	  		let order_id = this.carInfo.order_id
	  		if(!order_id){
	  			order_id=[]
	  		}else{
	  			order_id=eval(order_id)
	  		}
	  		order_id.push(orderId)
	  		let order_id_str = `[${order_id.toString()}]`
	  		await this.updateCarInfo(`{"order_id":"${order_id_str}"}`)

	  		await this.$confirm('已成功新建订单', '提示', {
		          confirmButtonText: '添加新订单',
		          cancelButtonText: '开始配送',
		          type: 'info',
		          center: true,
		          customClass:"confirmClass"
		        }).then(() => {
		        	if(this.confirmBoxId()==true){
		        		this.form.phoneNumber=""
		        		this.keyword=""
		        	}else{
		        		this.$message({
				            type: 'error',
				            message: '不能继续添加订单!'
				         });
		        		uni.navigateBack({
					          delta: 1
					    });
		        	}
		        }).catch(async function(){
		        	let operation = `'{"name":"start"}'`
		          	await _this.updateCarOperation(operation)
		          	uni.navigateBack({
					          delta: 1
					});
		        });


	  	},
	  	getCarInfo:async function(){
	  		const postData = {
	  				car_id:this.carId
	  			}
	  		const result = await this.$http.post('http://www.zonglang.xin:3000/getCar',postData,{emulateJSON:true})
	  		this.carInfo=result.body.car
	  	},
	  	updateCarInfo:async function(updateContent){
	  		const postData = {
	  			car_id:this.carId,
	  			updateContent:updateContent
	  		}
	  		console.log(postData)
	  		const result = await this.$http.post("http://www.zonglang.xin:3000/updateCar",JSON.stringify(postData),{emulateJSON:true})
	  		console.log(result)
	  	},
	  	updateCarOperation:async function(operation){
	  		const postData = {
	  			car_id:this.carId,
	  			operation:operation
	  		}
	  		const result = await this.$http.post("http://www.zonglang.xin:3000/updateCarOperation",postData,{emulateJSON:true})
	  	},
	  	createOrder:async function(){
	  		const postData = {
	  			car_id:this.carId,
	  			startPoint:this.form.startPoint,
	  			endPoint:this.form.endPoint,
	  			phoneNumber:this.form.phoneNumber,
	  			authCode:this.form.code,
	  			creator_id:this.creatorId,
	  			box_id:this.form.boxId
	  		}
	  		console.log(postData)
	  		const result = await this.$http.post("http://www.zonglang.xin:3000/createOrder",postData,{emulateJSON:true})
	  		return result.body.insertId
	  	},
	  	confirmBoxId(){
	  		//确定箱门id
			const box_state = eval(this.carInfo.box_state)
			for(var i=0;i<box_state.length;i++){
				if(box_state[i]==0){
					this.form.boxId=i
					return true
				}
			}
			if(i==box_state){
				return false;
			}
	  	},
	  	sleepTime:function (time=1000){
	  		return new Promise((resolve) => {
	  			setTimeout(resolve,time)
	  		})
	  	}
	}
}
</script>

<style>
	#createOrder{
		padding:20px;
	}
	.title{
		margin:16px auto;
	}
	.map{
		height:300px;
		width:100%;
	}
	.confirmClass{
		width:80vw !important;
		margin:0 auto;
	}
</style>