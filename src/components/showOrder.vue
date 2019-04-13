<template>
	<div class="showOrder">
		<div class="close">
			<i class="el-icon-error" @click="close"></i>
		</div>
		<el-card class="box-card"
				v-for="order in orders">
				<span>
		  			{{!order.target_name?"无姓名":order.target_name}}
				</span>
				<span>
		  			{{!order.phoneNumber?"无手机号":order.phoneNumber}}
				</span>
		  		<el-button type="success" plain @click="handleClick()">查看详情</el-button>
		</el-card>
	</div>
</template>

<script>
export default{
	name:"showOrder",
	mounted(){
		this.getOrder()
		document.title = "订单列表"
	},
	data(){
		return{
			orders:[]
		}
	},
	methods:{
		getOrder:async function(){
			const postData = {
    				user_id:"1",
    				identity:"xiaoge"
    		}
    		const result = await this.$http.post('http://www.zonglang.xin:3000/getOrder',postData,{emulateJSON:true})
    		this.orders=result.body.order
    		console.log(result.body.order)
		},
		handleClick(){
			this.$router.push({path:'/orderDetail'})
		},
		close(){
			console.log("点击关闭")
			this.$router.back(-1)
		}
	}	
}
</script>

<style scoped>
.showOrder{
	overflow: auto;
	height: 100%;
}
.box-card{
	margin:20px 10px;
	display: flex;
	justify-content: space-between;
}
.close{
	position:fixed;
	right:5px;
	top:10px;
	font-size: 28px;
	padding-right: 20px;
	text-align: right;
}
</style>