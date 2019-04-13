<template>
  <div class="searchLocation">
    <!-- <div class="header">
      <el-form>
        <el-form-item label="小兵出发位置:">
          <el-select v-model="startPoint" :clearable="true" placeholder="请选择起点">
            <el-option
              v-for="(item,index) in startChoice"
              :key="index"
              :label="item"
              :value="item"
              :change="changeStart()">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户手机号:">
          <el-input
            placeholder="请输入用户手机号"
            v-model="phoneNumber"
            style="width:200px"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
    </div> -->
    
  	<baidu-map :center="walk_end" 
  				:zoom="18"
  				:scroll-wheel-zoom="true"
          :high-resolution="false"
  				>

        <bm-view class="map">
        </bm-view>

    		<bm-walking 
            :start="walk_start" 
            :end="walk_end" 
            :autoViewport="false"
            :panel="false"
            @searchcomplete="searchcomplete"
            >
        </bm-walking>
    </baidu-map>
  </div>
</template>

<script>
export default{
  name: 'searchLocation',
  mounted(){
  		// this.start=this.$route.query.start;
  		// if(this.start==1){
  		// 	//南门
  		// 	this.walk_start.lng=114.350067;
  		// 	this.walk_start.lat=30.517362;
  		// }else if(this.start==2){
  		// 	//东门
  		// 	this.walk_start.lng=114.351513;
  		// 	this.walk_start.lat=30.51828;
  		// }
  },
  data(){
  	return{
  		// location:"{lng: 114.35100112284393, lat: 30.518365592201096}",
  		location:{
  			"lng":114.35100112284393,
  			"lat":30.518365592201096
  		},
  		walk_start:{
  			"lng":114.345245,
  			"lat":30.518474
  		},
  		walk_end:{
  			"lng":114.341463,
  			"lat":30.517405
  		},
  		center:{
  			"lng":114.35100112284393,
  			"lat":30.518365592201096
  		},
      startChoice:["南门","东门"],
  		keyword: '',
  		map:"",
  		start:"",
      startPoint:"",
      input:"",
      phoneNumber:"",
      pointList:[]
  	}
  },
  methods:{
  	test(res){
  		// console.log(this.map.getOverlays());
  		//console.log(res)
  	},
  	getResultPosition(res){
  		console.log(res)
  		//首先去除所有函数自己画的标志
  		console.log("function:clearAllMarkers")
  		var allOverlay = this.map.getOverlays();
        for (var i = 0; i < allOverlay.length; i++){  
			console.log(allOverlay[i])
			if(allOverlay[i].point)
				if(allOverlay[i].point.lng==this.location.lng && allOverlay[i].point.lat==this.location.lat)
					continue;
            this.map.removeOverlay(allOverlay[i]);       
        }
		//画标识点
  		this.location.lng=this.center.lng=res[0].point.lng;
  		this.location.lat=this.center.lat=res[0].point.lat;
  		this.walk_end.lng=this.location.lng;
  		this.walk_end.lat=this.location.lat;
  	},
  	dragging(){
  		console.log(this.map.getCenter());
  		// this.location="{lng: "+res.point.lng+", lat: "+res.point.lat+"}";
  		this.location.lng = this.map.getCenter().lng;
  		this.location.lat = this.map.getCenter().lat;
  	},
  	dragend(){
  		// this.walk_end.lng=this.location.lng;
  		// this.walk_end.lat=this.location.lat;
  	},
    moveend(){
      console.log("moveend")
      this.walk_end.lng=this.location.lng;
      this.walk_end.lat=this.location.lat;
    },
    changeStart(item){
      if(this.startPoint=="南门"){
        this.walk_start.lng=114.350067
        this.walk_start.lat=30.517362
      }else if(this.startPoint=="东门"){
        this.walk_start.lng=114.351513
        this.walk_start.lat=30.51828
      }
    },
    cancelFocus(){
      console.log("cancleFocus")
      this.$refs.searchInput.blur();
    },
  	getMap({map}){
  		this.map = map;
  		console.log(this.map)
  	},
    searchcomplete(res){
      console.log(JSON.stringify(res.xr[0].dk[0].zr))
      this.pointList=res.xr[0].dk[0].zr
    },
    complete(result){
      console.log(result)
    },
    submitContent(){
      console.log("点击按钮了")
      var postList=JSON.stringify(this.pointList)
      var startPoint=this.walk_start
      var endPoint=this.walk_end
      var phoneNumber=this.phoneNumber

      console.log(JSON.stringify(postList))
      uni.postMessage({
            data: {
              order:{
                "pointList": postList,
                "startPoint": startPoint,
                "endPoint":endPoint,
                "phoneNumber": phoneNumber
              }               
            }
      });
      uni.navigateBack({
          delta: 1
      });
      // uni.getEnv(function(res) {
      //       console.log('当前环境：' + JSON.stringify(res));
      //   });
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.searchLocation{
	
}

.map{
	/*height: 100vh;*/
	height:100px;
	width:100px;
}
</style>
