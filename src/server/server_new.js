var express = require('express');
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');//解析,用req.body获取post参数
var app = express();
var fs=require("fs");
var connection = mysql.createConnection({
  host     : '0.0.0.0',
  user     : 'root',
  password : '999219',
  database : 'xiaobin'
});
connection.connect();

const gcoord = require('gcoord');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var AK="MrSGqVgULhXQEtyBV67fPhCywrczDIjC";

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    with(Math){
        r1=Number(arg1.toString().replace(".",""));
        r2=Number(arg2.toString().replace(".",""));
        return (r1/r2)*pow(10,t2-t1);
    }
}
//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}
//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}
//减法函数
function accSub(arg1,arg2){
     var r1,r2,m,n;
     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
     m=Math.pow(10,Math.max(r1,r2));
     //last modify by deeka
     //动态控制精度长度
     n=(r1>=r2)?r1:r2;
     return Number(((arg2*m-arg1*m)/m).toFixed(n));
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg){
    return accDiv(this, arg);
};
//给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg){
    return accMul(arg, this);
};
//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg){
    return accAdd(arg,this);
}
///给number类增加一个sub方法，调用起来更加方便
Number.prototype.sub = function (arg){
    return accSub(arg,this);
}



/*
*	提取原始字符数据，输出经纬度坐标数组[[N,E],[N,E]]
*/
function filter_origin_data(data){
	//过滤出N和E
	var reg=/\d+\.\d+,N,\d+\.\d+,E/g;
	var stringArr = String.prototype.match.call(data,reg);
	var dataArr = [];
	//改成经纬度格式的数组
	//toFixed()方法返回的是字符串
	stringArr.map(function(item){
		var result = item.split(",");
		var shu=Number(result[2]).div(100);
		var zhengshu=Math.floor(shu);
		var xiaoshu=shu.sub(zhengshu);
		var e=Number(zhengshu.add(xiaoshu.mul(100/60)).toFixed(6));
		shu=Number(result[0]).div(100);
		zhengshu=Math.floor(shu);
		xiaoshu=shu.sub(zhengshu);
		var n=Number(zhengshu.add(xiaoshu.mul(100/60)).toFixed(6));
		dataArr.push([e,n]);
	})
	return dataArr;
}
/*
*	将WGS84坐标数组转换为BD09坐标数组
*/
function transformList_WGS84_BD09(WGSarr){
	var BD09arr=[];
	WGSarr.map(function(item){
		result=gcoord.transform(
			item,
			gcoord.WGS84,
			gcoord.BD09
		)
		BD09arr.push([Number(result[0].toFixed(6)),Number(result[1].toFixed(6))]);
	})
	return BD09arr;
}
/*
*	将BD09坐标数组转换为WGS84坐标数组
*/
function transformList_BD09_WGS84(BD09arr){
	var WGS84arr=[];
	BD09arr.map(function(item){
		result=gcoord.transform(
			item,
			gcoord.BD09,
			gcoord.WGS84
		)
		WGS84arr.push([Number(result[0].toFixed(6)),Number(result[1].toFixed(6))]);
	})
	return WGS84arr;
}
/*
*	将经纬度坐标转换成GPS参数
*/
function tranformList_toGPS(fromArr){
	var toArr = [];
	fromArr.map(function(item){
		var xiaoshu=item[0].sub(Math.floor(item[0]));
		var zhengshu=Math.floor(item[0]);
		var dataStr=String(zhengshu)+String(xiaoshu.mul(60));
		var e=Number(Number(dataStr).toFixed(5));

		xiaoshu=item[1].sub(Math.floor(item[1]));
		zhengshu=Math.floor(item[1]);
		dataStr=String(zhengshu)+String(xiaoshu.mul(60));
		var n=Number(Number(dataStr).toFixed(5));

		toArr.push([n,e]);
	})
	return toArr;
}
/*
*	将GPS参数转换成经纬度坐标
*/
function tranformList_fromGPS(fromArr){
	var toArr = [];
	fromArr.map(function(item){
		var shu=Number(item[0]).div(100);
		var zhengshu=Math.floor(shu);
		var xiaoshu=shu.sub(zhengshu);
		var n=Number(zhengshu.add(xiaoshu.mul(1.667)).toFixed(6));
		shu=Number(item[1]).div(100);
		zhengshu=Math.floor(shu);
		xiaoshu=shu.sub(zhengshu);
		var e=Number(zhengshu.add(xiaoshu.mul(1.667)).toFixed(6));

		toArr.push([e,n]);
	})
	return toArr;
}
/*
*	从数组格式到对象格式
*/
function transform_list_object(fromArr){
	var toArr=[];
	fromArr.map(function(item){
		toArr.push({
			'lng':item[0],
			'lat':item[1]
		})
	})
	return toArr;
}
/*
*	从对象格式到数组格式
*/
function transform_object_list(fromArr){
	var toArr=[];
	fromArr.map(function(item){
		toArr.push([item.lng,item.lat])
	})
	return toArr;
}

// var orginData=fs.readFileSync("data.txt","utf-8");

// var WSG84_data_arr=filter_origin_data(orginData);
function mergeArr(arr){
	var result=[];
	arr.map(function(point){
			for(var index in result){
				if(point[0]==result[index][0] && point[1]==result[index][1]){
					result[index][2]++;
					return;
				}
			}
			result.push([point[0],point[1],1]);
		})
	return result;
}
function filterTimes(arr,times){
	var result=[];
	arr.map(function(point){
		if(point[2]>=times){
			result.push([point[0],point[1]])
		}
	})
	return result;
}
// console.log(mergeArr(WSG84_data_arr));
// console.log(filterTimes(mergeArr(WSG84_data_arr),3));

// var BD09_data_arr=transformList_WGS84_BD09(filterTimes(mergeArr(WSG84_data_arr),3));
// var BD09_data_arr=transformList_WGS84_BD09(WSG84_data_arr);
// BD09_data_arr=BD09_data_arr.concat(WSG84_data_arr)
// var BD09_data_obj=transform_list_object(BD09_data_arr);

function saveData(gpsData){
	fs.writeFile('message.txt','===Message Start===\r\n',function(err){
		if(err) console.log("失败");
		else console.log("写入文件");
	})
	gpsData.map(function(item){
		var str=item.toString()+"\r\n";
		fs.appendFile('message.txt', str, function(err){
	       if(err) console.log('追加文件操作失败')
	   })
	})
}

var postGPS=[];
// var data=tranformList_toGPS(WSG84_data_arr);
// console.log(WSG84_data_arr)
// console.log(BD09_data_arr)
// console.log(BD09_data_obj)
// console.log(transformList_BD09_WGS84(BD09_data_arr))
// console.log(tranformList_toGPS(transformList_BD09_WGS84(BD09_data_arr)))
// console.log(tranformList_fromGPS(tranformList_toGPS(transformList_BD09_WGS84(BD09_data_arr))))



// console.log(filter_origin_data(data))
// console.log(transformList_WGS84_BD09(filter_origin_data(data)))
// console.log(transform_object_list(transform_list_object(transformList_WGS84_BD09(filter_origin_data(data)))))

app.all("*",function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
})
app.post('/transform',function (req, res) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    var orginData=fs.readFileSync("data.txt","utf-8");
	var WSG84_data_arr=filter_origin_data(orginData);
	var BD09_data_arr=transformList_WGS84_BD09(WSG84_data_arr);
	var BD09_data_obj=transform_list_object(BD09_data_arr);
	var saveD = tranformList_toGPS(WSG84_data_arr);
	saveData(saveD);
	res.end(JSON.stringify(BD09_data_obj));
});

app.post('/nowlocation',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

	try{
		connection.query('select location from location_info',function(error,results,fields){
		    if(error) throw error;
		    var arr=results[0].location.split(",")
		    arr.splice(1,0,"N");
		    arr.splice(3,0,"E");
		    var orginData=arr.join(",");
			var WSG84_data_arr=filter_origin_data(orginData);
			var BD09_data_arr=transformList_WGS84_BD09(WSG84_data_arr);
			var BD09_data_obj=transform_list_object(BD09_data_arr);
			res.end(JSON.stringify({success:true,list:BD09_data_obj}));
		})
	}
	catch(err){
		console.log(err);
		res.end({success:false})
	}
	
})


app.post('/postGPS',function(req,res){
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');


    // console.log(JSON.parse(req.body.GPSList));
    var BD09_data_obj = JSON.parse(req.body.GPSList);
    var BD09_data_arr = transform_object_list(BD09_data_obj);
    var WSG84_data_arr = transformList_BD09_WGS84(BD09_data_arr);
    postGPS=tranformList_toGPS(WSG84_data_arr);

    saveData(postGPS);
    res.end(JSON.stringify({"state":200}));
})

app.post('/downloadGPS',function(req,res){
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

     var WSG84_data_arr = tranformList_fromGPS(postGPS);
     var BD09_data_arr = transformList_WGS84_BD09(WSG84_data_arr); 
     var BD09_data_obj = transform_list_object(BD09_data_arr);

     res.end(JSON.stringify(BD09_data_obj));
})

app.post('/login',function(req,res){
    // 获取post的账户和密码
    console.log(req.body)
    let account=req.body.account;
    let password=req.body.password;
    // 查询数据库内的账户密码
    let queryResult = new Promise(function(resolve){
    	connection.query('select * from account where account = ?',[account],function(err,result){
	    	//查询抛出结果
	    	resolve(result)
	    })
    })
    queryResult.then(function(result){
    	if(result[0].password==password){
	    	res.end(JSON.stringify({"result":"success",...result[0]}))
    	}else{
    		res.end(JSON.stringify({"result":"fail"}))
    	}
    })
    
})
app.post('/reg',function(req,res){
	res.header("Access-Control-Allow-Origin","*");
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    //获取post的注册内容
    let account=req.body.account;
    let password=req.body.password;
    let userName=req.body.userName || "未命名";
    let identity=req.body.identity || "user";
    let phoneNumber=req.body.phoneNumber || null;
    // 首先判断有没有重复类型
    let queryResult = new Promise(function(resolve){
    	connection.query('select * from account where account = ?',[account],function(err,result){
	    	//查询抛出结果
	    	resolve(result)
	    })
    })
    queryResult.then(function(result){
    	//如果没有重复
    	if(result.length==0){
    		connection.query("INSERT INTO account (account,password,userName,identity,phoneNumber) VALUES ?"
    			,[[[account,password,userName,identity,phoneNumber]]]
    			,function(err,result){
    			res.end(JSON.stringify({"result":"success"}))
    		})
    	}else{
    		res.end(JSON.stringify({"result":"fail"}))
    	}
    })
})
app.post('/createOrder',function(req,res){
	console.log("/creatOrder is invoked")
    //获取post内容
    let startPoint = req.body.startPoint;
    let endPoint = req.body.endPoint;
    let phoneNumber = req.body.phoneNumber;
    let authCode = req.body.authCode || null;
    let state = 0;
    let car_id = req.body.car_id;
    let creator_id = req.body.creator_id;
    let target_id = null;
    let box_id = req.body.box_id;
    let target_name = req.body.target_name;
    let target_sex = req.body.target_sex;
    //查询target_id
    let queryResult = new Promise(function(resolve){
    	connection.query('select user_id from account where phoneNumber = ?',[phoneNumber],function(err,result){
    		//查询结果抛出
    		resolve(result)
    	})
    })
    queryResult.then(function(result){
    	if(result.length!=0){
    		target_id=result[0].user_id
    	}

    }).then(function(){
    	connection.query("INSERT INTO order_info (startPoint,endPoint,phoneNumber,authCode,state,car_id,creator_id,target_id,box_id,target_name,target_sex) VALUES ?"
    		,[[[startPoint,endPoint,phoneNumber,authCode,state,car_id,creator_id,target_id,box_id,target_name,target_sex]]]
    		,function(err,result){
                console.log(result)
    			res.end(JSON.stringify(result))
    		})
    }).catch(function(){
    	res.end(JSON.stringify({"result":"fail"}))
    })
})
app.post('/getOrder',function(req,res){
    //获取post内容
    console.log("/getOrder is invoked")
    console.log(req.body)
    let user_id = req.body.user_id;
    let identity = req.body.identity;
    let queryResult = new Promise(function(resolve){
    	if(identity=="user"){
    		connection.query('select * from order_info where target_id = ?',[user_id],function(err,result){
    			//查询结果抛出
    			resolve(result)
    		})
    	}else if(identity=="xiaoge"){
    		connection.query('select * from order_info where creator_id = ?',[user_id],function(err,result){
    			//查询结果抛出
    			resolve(result)
    		})
    	}
    })
    queryResult.then(function(result){
    	res.end(JSON.stringify({"result":"success","order":result}))
    }).catch(function(){
    	res.end(JSON.stringify({"result":"fail"}))
    })
})
app.post('/updateOrder',function(req,res){
	console.log("/updateOrder is invoked")
    //获取post内容
    let order_id = req.body.order_id;
    let updateContent = JSON.parse(req.body.updateContent);
    let promiseList = []
    //遍历updateContent进行更改操作
    for(var prop in updateContent){
    	let sql = `update order_info set ${prop}=${updateContent[prop]} where order_id=${order_id}`
    	console.log(sql);
    	let promise = new Promise(function(resolve){
    		connection.query(sql,function(err,result){
    			resolve()
    		})
    	})
    	promiseList.push(promise)
    }
    //当所有的sql异步操作完成之后再进行回复
    Promise.all(promiseList).then(function(){
    	res.end(JSON.stringify({"result":"ok"}))
    }).catch(function(){
    	res.end(JSON.stringify({"result":"fail"}))
    })
})
app.post('/getCar',function(req,res){
	console.log("/getCar is invoked")
    //获取post内容
    let car_id = req.body.car_id;
    let queryResult = new Promise(function(resolve){
    	connection.query('select * from car_info where car_id = ?',[car_id],function(err,result){
    		//查询结果抛出
    		resolve(result)
    	})
    })
    queryResult.then(function(result){
    	if(result.length==1){
    		res.end(JSON.stringify({"result":"ok","car":result[0]}))
    	}else{
    		res.end(JSON.stringify({"result":"fail"}))
    	}
    })
})
app.post('/updateCar',function(req,res){
	console.log("/updateCar is invoked")
    //获取post内容
    console.log(req.body)
    let car_id = req.body.car_id;
    let updateContent = JSON.parse(req.body.updateContent);
    let promiseList = []
    //遍历updateContent进行更改操作
    for(var prop in updateContent){
        let sql = `update car_info set ${prop}='${updateContent[prop]}' where car_id=${car_id}`
        console.log(sql);
        let promise = new Promise(function(resolve){
            connection.query(sql,function(err,result){
                resolve()
            })
        })
        promiseList.push(promise)
    }
    //当所有的sql异步操作完成之后再进行回复
    Promise.all(promiseList).then(function(){
    	res.end(JSON.stringify({"result":"ok"}))
    }).catch(function(){
    	res.end(JSON.stringify({"result":"fail"}))
    })
})
app.post('/updateCarOperation',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    let operation = req.body.operation
    let car_id = req.body.car_id
    let sql = `update car_info set operation=${operation} where car_id=${car_id}`
    console.log(sql)
    new Promise(function(resolve){
            connection.query(sql,function(err,result){
                resolve()
            })
        }).then(() => {res.end(JSON.stringify({"result":"ok"}))})
})
// app.post('/distance',function(req,res){
// 	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

 //    var url="http://api.map.baidu.com/telematics/v3/distance?waypoints=118.77147503233,32.054128923368;116.3521416286,39.965780080447;116.28215586757,39.965780080447&ak=MrSGqVgULhXQEtyBV67fPhCywrczDIjC"
 //    request(url,function(error,response,body){
	// 	if(!error && response.statusCode == 200){
	// 		// console.log(JSON.parse(body).result);
	// 		// if((JSON.parse(body).status==25)){
	// 		// 	console.log(url);
	// 		// }
	// 		console.log(body);
	// 		// console.log(JSON.parse(body))
	// 		JSON.parse(body).result.forEach(function(item){
	// 			GPSList.push({
	// 				'lng':item.x,
	// 				'lat':item.y
	// 			})
	// 		})
	// 		// GPSList=GPSList.concat(JSON.parse(body).result);
	// 	}
	// })
// })

app.listen(3000, function () {
  console.log('app is listening at port 3000...');
});