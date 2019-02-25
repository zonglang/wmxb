<template>
	<div class="showCarMap">
		
		<bm-marker 
			v-for="(item,index) in markerList"
			:key="index"
			:position="item">	
		</bm-marker>
		<bm-point-collection :points="GPSList" shape="BMAP_POINT_SHAPE_CIRCLE" color="red" size="BMAP_POINT_SIZE_TINY"></bm-point-collection>

		<bm-point-collection :points="GPSList2" shape="BMAP_POINT_SHAPE_CIRCLE" color="green" size="BMAP_POINT_SIZE_TINY"></bm-point-collection>

		</baidu-map>
		<span>api状态:{{state}}</span>
		<button @click="returnResult">确定</button>
		<button @click="setMarker">选取</button>
		<button @click="returnDistance">测距</button>
		<input type="number" v-model="jianju">
		<button @click="drawAllLine">绘图</button>
		<button @click="postGPS">上传</button>
		<button @click="downloadGPS">下载</button>
	</div>
	
</template>


<script>
export default{
	name:'showCarMap',
	data() {
		return{
			msg:"$GNRMC,071628.00,A,3030.86958,N,11420.34291,E,0.012,,150119,,,D*6E",
			GPSList:[],
			GPSList2:[],
			markerList:[],
			state:"正常",
			pointA:[114.351517,30.518298],
			pointB:[114.348516,30.518706],
			distance:0,
			jianju:1,
			map:""
		}
	},
	mounted(){
		this.getNowLocation();
	},
	methods:{
		returnResult(){
			this.$http.post('http://localhost:3000/transform',{"str":this.msg},{emulateJSON:true}).then(function(res){
				this.GPSList=this.GPSList.concat(res.body);
				console.log(res.body)
			},function(){});
		},
		returnDistance(){
			this.$http.post('http://localhost:3000/distance',{"pointA":this.pointA,"pointB":this.pointB},{emulateJSON:true}).then(function(res){this.distance=res.body.distance},function(){})
		},
		getNowLocation(){
			setInterval(()=>{
				this.$http.post('http://47.93.192.32:8082/nowlocation',{},{emulateJSON:true}).then(function(res){
					console.log(res.body);
					this.markerList=res.body;
				},function(){})
			},1000)
		},
		getdistance({map}){
			
			this.map=map;
			// map.addEventListener("click",function(e){
			// 	alert(e.point.lng + "," + e.point.lat);
			// });
		},
		setMarker(){
			var that=this;
			this.map.addEventListener("click",function(e){
				that.markerList.push({
					"lng":e.point.lng,
					"lat":e.point.lat
				})
			})
		},
		drawAllLine(){
			var that=this;
			this.GPSList=[];
			this.markerList.reduce(function(point1,point2){
				that.drawLine(point1,point2);
				return point2;
			})
		},
		drawLine(point1,point2){
			var pointA = new BMap.Point(point1.lng,point1.lat);  // 创建点坐标A--大渡口区
			var pointB = new BMap.Point(point2.lng,point2.lat);  // 创建点坐标B--江北区
			this.distance=this.map.getDistance(pointA,pointB).toFixed(2)
			console.log("###"+this.distance)
			var ax=point1.lng;
			var ay=point1.lat;
			
			var bx=point2.lng;
			var by=point2.lat;

			var d=this.distance;

			var n =  Math.floor(d/this.jianju); 
			var dx = this.jianju*(bx - ax)/d;
			var dy = this.jianju*(by - ay)/d;
			var xc = dx + ax;
  			var yc = dy + ay;
  			this.GPSList.push({
  				"lng":point1.lng,
  				"lat":point1.lat
  			});
  			for(var i=1;i<=n;i++){
			  xc = Number((i*dx + ax).toFixed(7));
			  yc = Number((i*dy + ay).toFixed(7));
			  // console.log(xc+"###"+yc)
			  this.GPSList.push({
			  	"lng":xc,
			  	"lat":yc
			  });
			}
			this.GPSList.push({
  				"lng":point2.lng,
  				"lat":point2.lat
  			});
		},
		postGPS(){
			this.$http.post('http://localhost:3000/postGPS',{"GPSList":JSON.stringify(this.GPSList)},{emulateJSON:true}).then(function(){
			},function(){})
		},
		downloadGPS(){
			console.log("###########")
			this.$http.post('http://localhost:3000/downloadGPS',{},{emulateJSON:true}).then(function(res){
				// this.GPSList=[]
				// console.log(res.body)
				this.GPSList2=res.body;
			},function(){

			})
		}
	}
};
</script>

<style>
.showCarMap {
	width:100%;
}
/* The container of BaiduMap must be set width & height. */
.map {
  width: 100%;
  height: 700px;
}
</style>
