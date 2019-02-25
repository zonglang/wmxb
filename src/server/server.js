var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');//解析,用req.body获取post参数
var app = express();
var rf=require("fs");
var data=rf.readFileSync("data.txt","utf-8");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// app.all('/transform',function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

//     if (req.method == 'POST') {
//             var str=req.body;
// 			console.log(str);
// 			var reg=/\d{4}\.\d{5},N,\d{5}\.\d{5},E/g;
// 			var arr = String.prototype.match.call(str,reg)
// 			var GPSList=[];
// 			var i=0;
// 			var querystr="";
// 			var AK="MrSGqVgULhXQEtyBV67fPhCywrczDIjC";
// 			arr.map(function(item){
// 				var result=item.split(",")
// 				var shu=Number(result[2])/100
// 				var zhengshu=Math.floor(shu);
// 				var xiaoshu=shu-zhengshu;
// 				var e=(zhengshu+xiaoshu*100/60).toFixed(7);

// 				shu=Number(result[0])/100;
// 				zhengshu=Math.floor(shu);
// 				xiaoshu=shu-zhengshu;
// 				var n=(zhengshu+xiaoshu*100/60).toFixed(7);

// 				i=i+1;
// 				querystr=querystr+e+","+n+";"
// 				if(i==100){
// 					var url="http://api.map.baidu.com/geoconv/v1/?coords="+querystr+"&from=1&to=5&ak="+AK;
// 					request(url, function (error, response, body) {
// 					  if (!error && response.statusCode == 200) {
// 					    console.log(body) 
// 					    GPSList=GPSList.concat(res.result);
// 						i=0;
// 						querystr="";
// 					  }
// 					})
// 				}
// 			})
// 			if(i!=0){
// 				var url="http://api.map.baidu.com/geoconv/v1/?coords="+querystr+"&from=1&to=5&ak="+AK;
// 				request(url, function (error, response, body) {
// 				  if (!error && response.statusCode == 200) {
// 				    console.log(body) 
// 				    GPSList=GPSList.concat(res.result);
// 					i=0;
// 					querystr="";
// 				  }
// 				})
// 			}
//             res.send(JSON.stringify(GPSList));
//     }
//     else if(req.method == 'OPTIONS'){ //处理预验
//         res.send(200);//让options请求快速返回
//     }
//     else {
//         next();
//     }
// });
// app.listen(3000, function () {
//     console.log('app is listening at port 3000...');
// });
var AK="MrSGqVgULhXQEtyBV67fPhCywrczDIjC";
var reg=/\d{4}\.\d{5},N,\d{5}\.\d{5},E/g;
var arr = String.prototype.match.call(data,reg);
var GPSList=[];
var i=0;
var querystr="";
var query=[];

console.log(arr.length);

arr.map(function(item){

		var result=item.split(",")
		var shu=Number(result[2])/100
		var zhengshu=Math.floor(shu);
		var xiaoshu=shu-zhengshu;
		var e=(zhengshu+xiaoshu*100/60).toFixed(7);

		shu=Number(result[0])/100;
		zhengshu=Math.floor(shu);
		xiaoshu=shu-zhengshu;
		var n=(zhengshu+xiaoshu*100/60).toFixed(7);

		i=i+1;
		if(i==1){
			querystr=querystr+e+","+n
		}else{
			querystr=querystr+";"+e+","+n
		}
		
		if(i==100){
			query.push(querystr);
			querystr="";
			i=0;
		}
})
if(i!=0){
	query.push(querystr);
	i=0;
}
//使用promise处理
// Array.from(query).reduce(function(promise, value) {
// 	console.log("====================")
// 	console.log(promise)

// 	var url="http://api.map.baidu.com/geoconv/v1/?coords="+value+"&from=1&to=5&ak="+AK;
// 	i++;
// 	console.log(i)
// 	request(url,function(error,response,body){
// 		if(!error && response.statusCode == 200){
// 			GPSList=GPSList.concat(JSON.parse(body).result);
// 			promise.resolve();
// 		}
// 	})
//     return promise.then(function(){  				
//     				// console.log(i);
// 	              return Promise.resolve()
// 			})
//  },Promise.resolve('init'));
console.log(query.length);
for(value of query){
	var url="http://api.map.baidu.com/geoconv/v1/?coords="+value+"&from=1&to=5&ak="+AK;
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
			// console.log(JSON.parse(body).result);
			if((JSON.parse(body).status==25)){
				console.log(url);
			}
			
			// console.log(JSON.parse(body))
			JSON.parse(body).result.forEach(function(item){
				GPSList.push({
					'lng':item.x,
					'lat':item.y
				})
			})

		}
	})
}
function callBack(){
	console.log(GPSList.length);
}
setTimeout(callBack,10000);


app.post('/transform',function (req, res) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

	res.end(JSON.stringify(GPSList));
});

app.post('/distance',function(req,res){
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    var url="http://api.map.baidu.com/telematics/v3/distance?waypoints=118.77147503233,32.054128923368;116.3521416286,39.965780080447;116.28215586757,39.965780080447&ak=MrSGqVgULhXQEtyBV67fPhCywrczDIjC"
    request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
			// console.log(JSON.parse(body).result);
			// if((JSON.parse(body).status==25)){
			// 	console.log(url);
			// }
			console.log(body);
			// console.log(JSON.parse(body))
			JSON.parse(body).result.forEach(function(item){
				GPSList.push({
					'lng':item.x,
					'lat':item.y
				})
			})
			// GPSList=GPSList.concat(JSON.parse(body).result);
		}
	})
})

app.listen(3000, function () {
  console.log('app is listening at port 3000...');
});