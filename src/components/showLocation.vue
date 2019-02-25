<template>
  <div class="showLocation">
    <baidu-map class="map" 
		:center="{lng: 114.35100112284393, lat: 30.518365592201096}" 
		:zoom="18"
		:scroll-wheel-zoom="true"
		@ready=""
	>
		<bm-marker 
			:position="location">	
		</bm-marker>
	</baidu-map>
  </div>
</template>

<script>
export default {
  name: 'showLocation',
  mounted(){
  	this.getNowLocation();
  },
  data(){
  	return{
  		location:"",
  	}
  },
  methods:{
  	getNowLocation(){
		setInterval(()=>{
			this.$http.post('http://47.93.192.32:8082/nowlocation',{},{emulateJSON:true}).then(function(res){
				// console.log(res.body);
				if(res.body.success==true)
					this.location=res.body.list[0];
				
			},function(){})
			
		},1000)
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
