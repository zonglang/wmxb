<template>
  <div class="showLocation">
    <baidu-map class="map" 
		:center="center" 
		:zoom="17"
		:scroll-wheel-zoom="true"
		@ready=""
	>
    <!-- 这个点显示当前位置 -->
		<bm-marker 
			:position="markerPoint">	
		</bm-marker>

	</baidu-map>
  <div class="scanCode"
        @click="scanCodeBtn">
    {{scanText}}
  </div>
  <div class="user"
        @click="userBtn">
    <img src="../assets/user.png">
  </div>
  <div class="location"
        @click="locationBtn">
    <img src="../assets/location.png">
  </div>
  <div class="help"
        @click="helpBtn">
    <img src="../assets/help.png">
  </div>
  <div class="more"
        @click="moreBtn">
    <img src="../assets/more.png">
  </div>
  </div>
</template>

<script>
export default {
  name: 'showLocation',
  mounted:async function(){
  	this.carId = this.$route.query.carid || ""
    this.creatorId = this.$route.query.creatorid || ""
    console.log("receive carid:",this.carId)
    console.log("receive location:",this.location)
    //在这个异步事件中阻塞循环
    //每隔一段时间从服务器获取一次数据
    const timeout = 1000
  	while(true){
  		await this.getCarInfo()
  		var point = this.carInfo.location.split(",")
  		// console.log(point)
  		this.center.lat=this.markerPoint.lat = point[0]
  		this.center.lng=this.markerPoint.lng = point[1]
  		await this.sleepTime(timeout)
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
      creatorId:"",
      location:"",
      barcode:null,
      scanText:"扫码用车"
  	}
  },
  methods:{
  	sleepTime:async function (time=1000){
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
    scanCodeBtn(){
      console.log("点击了扫码按钮");
      if(!this.barcode){
        this.createBarcode()
        this.scanText="关闭扫码"
      }else{
        this.closeBarcode()
        this.scanText="扫码用车"
      }
    },
    createBarcode(){
      this.barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
          top:'100px',
          left:'0px',
          width: '100%',
          height: '500px',
          position: 'static'
        });
      this.barcode.onmarked = onmarked;
      plus.webview.currentWebview().append(this.barcode);
      this.barcode.start();
      // 扫码成功回调
      function onmarked(type, result) {
        var text = '未知: ';
        switch(type){
          case plus.barcode.QR:
          text = 'QR: ';
          break;
          case plus.barcode.EAN13:
          text = 'EAN13: ';
          break;
          case plus.barcode.EAN8:
          text = 'EAN8: ';
          break;
        }
        console.log( text+result )
      }
    },
    closeBarcode(){
      this.barcode.close()
      this.barcode=null
    },
    locationBtn(){
      console.log("点击了定位按钮")
      plus.geolocation.getCurrentPosition(function(p){
          console.log('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude + '\nAltitude:' + p.coords.altitude);
        }, function(e){
          console.log('Geolocation error: ' + e.message);
        });
    },
    moreBtn(){
      console.log("点击了更多按钮")
    },
    helpBtn(){
      console.log("点击了帮助按钮")
      // uni.postMessage({
      //       data: {
      //         "operation":"help"   
      //       }
      // });
      // uni.navigateBack({animationDuration: 0})
    },
    userBtn(){
      console.log("点击了用户按钮")
      uni.navigateTo({
          url: '/pages/ucenter/ucenter'
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.showLocation{
	width:100%;
	height: 100vh;
  overflow: hidden;
}
.map{
	height: 110vh;
}
.scanCode{
  position:fixed;
  width:100vw;
  height:65px;
  line-height: 65px;
  bottom:0;
  background: rgba(4,181,80,0.9);
  color:white;
  font-size:20px;
}
.user{
  position:fixed;
  right:0px;
  bottom:80px;
  width:70px;
  height:36px;
  border-radius: 18px 0 0 18px;
  background: white;
  /*添加阴影*/
  box-shadow: 4px 4px 8px #888888;
}
/*div内部img垂直居中*/
.user img{
  height: 20px;
  position:absolute;
  top:0;
  bottom: 0;
  margin:auto -15px;
}

.location{
  position: fixed;
  right:30px;
  bottom: 150px;
  width:35px;
  height: 35px;
  background: white;
  border-radius: 50%;
  box-shadow: 4px 4px 8px #888888;
}
.location img{
  height: 20px;
  position:absolute;
  top:0;
  bottom: 0;
  left:0;
  right: 0;
  margin:auto;
}

.help{
  position: fixed;
  left:30px;
  bottom: 80px;
  width:35px;
  height: 35px;
  background: white;
  border-radius: 50%;
  box-shadow: 4px 4px 8px #888888;
}
.help img{
  height: 25px;
  position:absolute;
  top:0;
  bottom: 0;
  left:0;
  right: 0;
  margin:auto;
}

.more{
  position: fixed;
  left:30px;
  bottom: 150px;
  width:35px;
  height: 35px;
  background: white;
  border-radius: 50%;
  box-shadow: 4px 4px 8px #888888;
}
.more img{
  height: 13px;
  position:absolute;
  top:0;
  bottom: 0;
  left:0;
  right: 0;
  margin:auto;
}
</style>
