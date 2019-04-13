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
		
	     <!-- <bm-marker 
			v-for="(item,index) in pointList"
			:key="index"
			:position="item">	
		</bm-marker> -->
		<bm-point-collection :points="pointList" 
							shape="BMAP_POINT_SHAPE_CIRCLE" 
							color="red" 
							size="BMAP_POINT_SIZE_SMALLER" 
							>
			
		</bm-point-collection>
		<!-- <bm-point-collection :points="pointList2" 
							shape="BMAP_POINT_SHAPE_CIRCLE" 
							color="red" 
							size="BMAP_POINT_SIZE_SMALLER" 
							>
			
		</bm-point-collection> -->
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
  			pointList:[],
  			pointList2:[{"lng":"114.345227","lat":"30.518373"},{"lng":"114.345196","lat":"30.518357"},{"lng":"114.345151","lat":"30.518338"},{"lng":"114.345133","lat":"30.518322"},{"lng":"114.345106","lat":"30.518307"},{"lng":"114.345061","lat":"30.518276"},{"lng":"114.345025","lat":"30.51826"},{"lng":"114.344985","lat":"30.518233"},{"lng":"114.34494","lat":"30.51821"},{"lng":"114.344895","lat":"30.51819"},{"lng":"114.344868","lat":"30.518175"},{"lng":"114.344837","lat":"30.518163"},{"lng":"114.344805","lat":"30.518143"},{"lng":"114.344774","lat":"30.51812"},{"lng":"114.344738","lat":"30.518105"},{"lng":"114.344702","lat":"30.518089"},{"lng":"114.344679","lat":"30.518073"},{"lng":"114.344657","lat":"30.518058"},{"lng":"114.344635","lat":"30.518054"},{"lng":"114.344603","lat":"30.518046"},{"lng":"114.344576","lat":"30.518046"},{"lng":"114.344549","lat":"30.518046"},{"lng":"114.344518","lat":"30.518066"},{"lng":"114.3445","lat":"30.518073"},{"lng":"114.344477","lat":"30.518089"},{"lng":"114.34445","lat":"30.518105"},{"lng":"114.344428","lat":"30.518116"},{"lng":"114.344392","lat":"30.518128"},{"lng":"114.344356","lat":"30.51814"},{"lng":"114.344316","lat":"30.518151"},{"lng":"114.34428","lat":"30.518159"},{"lng":"114.344248","lat":"30.518159"},{"lng":"114.344212","lat":"30.518159"},{"lng":"114.34419","lat":"30.518159"},{"lng":"114.344154","lat":"30.518159"},{"lng":"114.344131","lat":"30.518151"},{"lng":"114.344091","lat":"30.518151"},{"lng":"114.344069","lat":"30.518143"},{"lng":"114.344042","lat":"30.518136"},{"lng":"114.34401","lat":"30.518124"},{"lng":"114.343988","lat":"30.518105"},{"lng":"114.34397","lat":"30.518093"},{"lng":"114.343956","lat":"30.518073"},{"lng":"114.343934","lat":"30.518062"},{"lng":"114.34392","lat":"30.518038"},{"lng":"114.343902","lat":"30.518027"},{"lng":"114.343884","lat":"30.518"},{"lng":"114.343866","lat":"30.517968"},{"lng":"114.343853","lat":"30.517933"},{"lng":"114.343844","lat":"30.517902"},{"lng":"114.343831","lat":"30.517875"},{"lng":"114.343831","lat":"30.517848"},{"lng":"114.343817","lat":"30.517817"},{"lng":"114.343804","lat":"30.517793"},{"lng":"114.343795","lat":"30.517778"},{"lng":"114.343759","lat":"30.517758"},{"lng":"114.343723","lat":"30.517727"},{"lng":"114.343691","lat":"30.5177"},{"lng":"114.343633","lat":"30.517669"},{"lng":"114.343592","lat":"30.517642"},{"lng":"114.34353","lat":"30.517603"},{"lng":"114.343494","lat":"30.517576"},{"lng":"114.343462","lat":"30.517556"},{"lng":"114.343417","lat":"30.517525"},{"lng":"114.343368","lat":"30.51751"},{"lng":"114.343336","lat":"30.517478"},{"lng":"114.343301","lat":"30.517463"},{"lng":"114.343251","lat":"30.517428"},{"lng":"114.343202","lat":"30.517389"},{"lng":"114.343157","lat":"30.517366"},{"lng":"114.34313","lat":"30.517346"},{"lng":"114.343103","lat":"30.517327"},{"lng":"114.343067","lat":"30.517315"},{"lng":"114.343045","lat":"30.517311"},{"lng":"114.343009","lat":"30.517315"},{"lng":"114.342982","lat":"30.517323"},{"lng":"114.342937","lat":"30.517327"},{"lng":"114.342896","lat":"30.517319"},{"lng":"114.342869","lat":"30.517323"},{"lng":"114.342842","lat":"30.517311"},{"lng":"114.342806","lat":"30.517307"},{"lng":"114.342784","lat":"30.517292"},{"lng":"114.342744","lat":"30.517288"},{"lng":"114.34273","lat":"30.517276"},{"lng":"114.342712","lat":"30.517261"},{"lng":"114.34269","lat":"30.517249"},{"lng":"114.342681","lat":"30.51723"},{"lng":"114.342645","lat":"30.517226"},{"lng":"114.342604","lat":"30.517226"},{"lng":"114.342568","lat":"30.517237"},{"lng":"114.342519","lat":"30.517245"},{"lng":"114.342429","lat":"30.517253"},{"lng":"114.342375","lat":"30.517268"},{"lng":"114.342308","lat":"30.517276"},{"lng":"114.342267","lat":"30.517288"},{"lng":"114.342191","lat":"30.517303"},{"lng":"114.342137","lat":"30.517315"},{"lng":"114.342083","lat":"30.517327"},{"lng":"114.342034","lat":"30.517327"},{"lng":"114.341971","lat":"30.517342"},{"lng":"114.341926","lat":"30.51735"},{"lng":"114.34189","lat":"30.517354"},{"lng":"114.34185","lat":"30.517354"},{"lng":"114.341818","lat":"30.517373"},{"lng":"114.341769","lat":"30.517381"},{"lng":"114.341715","lat":"30.517397"},{"lng":"114.34167","lat":"30.517405"}]
		}
	},
	mounted(){
		this.getPoint()
	},
	methods:{
		getMap:function({map}){
			this.map = map
			this.map.setDefaultCursor("crosshair");
			this.map.addControl(new BMap.MapTypeControl());          //添加地图类型控件
			this.map.addEventListener("click",(e) => {
				this.pointList.push({
					"lng":e.point.lng,
					"lat":e.point.lat
				})
				console.log(JSON.stringify(this.locationList))
			})
			var polyline = new BMap.Polyline([
				new BMap.Point(114.34458,30.517996),
				new BMap.Point(114.34525,30.518366),
			], {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});   //创建折线
			this.map.addOverlay(polyline);   //增加折线
			
			var polyline = new BMap.Polyline([
				new BMap.Point(114.343067,30.517285),
				new BMap.Point(114.343826,30.517771),
			], {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});   //创建折线
			this.map.addOverlay(polyline);   //增加折线

			var polyline = new BMap.Polyline([
				new BMap.Point(114.342663,30.517203),
				new BMap.Point(114.341639,30.517381),
			], {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});   //创建折线
			this.map.addOverlay(polyline);   //增加折线

			var curve = new BMapLib.CurveLine([
				new BMap.Point(114.343826,30.517771),
				new BMap.Point(114.344041,30.51812),
				new BMap.Point(114.34458,30.517996)
			], {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
			this.map.addOverlay(curve); //添加到地图中
			// curve.enableEditing(); //开启编辑功能

			var curve = new BMapLib.CurveLine([
				new BMap.Point(114.342663,30.517203),
				new BMap.Point(114.343067,30.517285),
			], {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
			this.map.addOverlay(curve); //添加到地图中
			// curve.enableEditing(); //开启编辑功能
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