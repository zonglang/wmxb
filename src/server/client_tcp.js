var net = require('net');
var fs=require("fs");

// var HOST = '47.93.192.32';
var HOST = '0.0.0.0';
var PORT = 10380;
 
var client = new net.Socket();

var orginData=fs.readFileSync("pathList.txt","utf-8");
orginData = orginData.replace(/\r\n/g,";");
orginArr = orginData.split(";");
var i=0;
var length=orginArr.length;
// client.connect(PORT, HOST, function() {
 
//     console.log('CONNECTED TO: ' + HOST + ':' + PORT);
//     // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
//     var data='{"location":"3030.87239,11420.31979"}';
//     client.write(data);	
    
 
// });
setInterval(()=>{
				client.connect(PORT, HOST, function() {
				    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
				    // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
				    arr=orginArr[i].split(',');
				    var data='{"location":"'+arr[0]+','+arr[1]+'"}';
				    i++;
				    if(i==length){
				    	i=0;
				    }
				    client.write(data);	
					})
			},200)


// setTimeout(function(){
//     	client.connect(PORT, HOST, function() {
// 		    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
// 		    // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
// 		    data=orginArr[i].split(',');
// 		    var data='{"location":"'+data[0]+','+data[1]+'"}';
// 		    i++;
// 		    client.write(data);	
// 		})
//     },2000)
 
// 为客户端添加“data”事件处理函数
// data是服务器发回的数据
client.on('data', function(data) {
 
    console.log('DATA: ' + data);
    // 完全关闭连接
    client.destroy();
 
});
 
// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.log('Connection closed');
});
