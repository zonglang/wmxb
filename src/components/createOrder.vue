<template>	
	<div id="createOrder">
		<el-card class="box-card">
		  	<el-form class="form" :model="form" label-width="60px">
				<el-form-item label="手机号:">
			    	<el-input ref="numInput" v-model="form.phoneNumber" placeholder="请填写收货手机号"></el-input>
			  	</el-form-item>
			  	<el-form-item label="联系人:">
			    	<el-input ref="nameInput" v-model="form.targetName" placeholder="请填写收货人的姓名"></el-input>
			  	</el-form-item>
			    <el-radio v-model="form.targetSex" label="male" border>小哥哥</el-radio>
	  			<el-radio v-model="form.targetSex" label="female" border style="margin:0 0 10px 0">小姐姐</el-radio>
			  	<el-form-item label="地址:">
			    	<el-select v-model="value" placeholder="请选择"
			    				ref="selectAddress"
			    				@change="selectChange" >
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
			  	</el-form-item>
			</el-form>
		</el-card>
		
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
	    	<bm-control  class="bmControl" id="bmControl">
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
	  	  	<el-button class="openButton" type="primary" @click="onSubmit" >打开箱门</el-button>
  		</baidu-map>
	</div>
</template>

<script>
export default{
	name: 'createOrder',
	mounted:async function(){
		// 页面传入信息为小哥的id
		//获取小车信息
		this.creatorId=this.$route.query.creatorid || 2;
		this.carId=this.$route.query.carid || "001";
		document.title = "创建订单"
		await this.getCarInfo()
		//确定箱门id
		if(await this.confirmBoxId()===false){
			this.$message({
	            type: 'error',
	            message: '不能添加订单!即将自动退出'
	         })
			//这里使用箭头函数改变this指向
			setTimeout(() => {
				// 跳转回扫码页面
				this.$router.push({path:'/showLocation'})
			},3000)	
		}
	},
	data(){
		return{
			form:{
				phoneNumber:"",
				targetName:"",
				targetSex:"male",
				startPoint:"",
				endPoint:"",
				boxId:"",
				code:""
			},
			options:[
			{
				label:"南一",
				value:JSON.stringify({
					"lng":114.334805,
	  				"lat":30.514547
				})
			},
			{
				label:"南二",
				value:JSON.stringify({
					"lng":114.334805,
	  				"lat":30.514352
				})
			},
			{
				label:"南三",
				value:JSON.stringify({
					"lng":114.334333,
	  				"lat":30.514041
				})
			},
			{
				label:"南四",
				value:JSON.stringify({
					"lng":114.334244,
	  				"lat":30.513746
				})
			},
			{
				label:"北三",
				value:JSON.stringify({
					"lng":114.335034,
	  				"lat":30.516865
				})
			},
			{
				label:"自定义",
				value:""
			}],
			value:"",
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
			//选择器显示自定义
	  		this.value = ""
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
	  		//选择器显示自定义
	  		this.value = ""
	  		this.markerPoint.lng = this.map.getCenter().lng;
  			this.markerPoint.lat = this.map.getCenter().lat;
  			//移出焦点
  			this.$refs.numInput.blur();
  			this.$refs.nameInput.blur();
  			this.$refs.selectAddress.blur();
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
	  		await this.sleepTime(2000)
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
		        }).then(async () => {
		        	if(await this.confirmBoxId()==true){
		        		this.form.phoneNumber=""
		        		this.keyword=""
		        	}else{
		        		this.$message({
				            type: 'error',
				            message: '不能继续添加订单!即将开始配送'
				         });
		        		settimeOut(function(){
		        			uni.navigateBack({
					          delta: 1
					    	});
		        		},3000)
		        	}
		        }).catch(async () => {
		        	let operation = `'{"name":"start"}'`
		          	await this.updateCarOperation(operation)
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
	  	confirmBoxId:async function(){
	  		//确定箱门id
	  		await this.getCarInfo()
			const box_state = eval(this.carInfo.box_state) || []
			let flag = false
			//选出没有装东西的箱门id
			box_state.forEach(item => {
				if(!flag && item == 0){
					this.form.boxId = item
					flag = true
				}
			})
			return flag
	  	},
	  	sleepTime:function (time=1000){
	  		return new Promise((resolve) => {
	  			setTimeout(resolve,time)
	  		})
	  	},
	  	selectChange(value){
	  		console.log(value)
	  		if(value !== "")
	  			this.center = this.markerPoint = JSON.parse(value)
	  	}
	}
};
</script>

<style>
	#createOrder{
		height: 100%;
		overflow: hidden;
	}
	.box-card{
		margin:20px 10px;
	}
	.title{
		margin:16px auto;
	}
	.map{
		height:60vh;
		width:100vw;
	}
	.confirmClass{
		width:300px !important;
		margin:0 auto;
	}
	#createOrder .openButton{
		position:fixed;
		width: 100px;
		bottom:20px;
		left:calc(50% - 50px);
	}
	#createOrder .bmControl{
		text-align: center;
		width:200px;
		left:calc(50% - 100px) !important;
	}
</style>