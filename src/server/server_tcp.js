var net = require('net');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '0.0.0.0',
  user     : 'root',
  password : '999219',
  database : 'xiaobin'
});
connection.connect();

var HOST="0.0.0.0";
var PORT=10380;


connection.query('select location from location_info',function(error,results,fields){
    if(error) throw error;
    console.log('The query result is :',results[0].location)
})

var new_location="3030.85427,11420.29981"
connection.query('update location_info set location=?',[new_location],function(err,result){
    if(err){
        console.log("ERROR,",err.message);
    }else{
        console.log("new_location:",new_location)
    }
});
 
// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(sock) {
 
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
 
    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);

        var new_location=JSON.parse(data).location;

        connection.query('update location_info set location=?',[new_location],function(err,result){
            if(err){
                console.log("ERROR,",err.message);
            }else{
                console.log("set new_location:",new_location)
            }
        });

        // 回发该数据，客户端将收到来自服务端的数据
        sock.write('You said "' + data + '"');
    });
 
    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
 
}).listen(PORT, HOST);
 
console.log('Server listening on ' + HOST +':'+ PORT);