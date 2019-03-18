var net = require('net');
var mysql = require('mysql');
var request = require('request');
const gcoord = require('gcoord');

var connection = mysql.createConnection({
  host     : '0.0.0.0',
  user     : 'root',
  password : '999219',
  database : 'xiaobin'
});
connection.connect();

var HOST="0.0.0.0";
var PORT=10380;

function transform(value){
    let origin = value.split(',')
    let result = gcoord.transform(
      [Number(origin[0]), Number(origin[1])],    // 经纬度坐标
      gcoord.WGS84,               // 当前坐标系
      gcoord.BD09                 // 目标坐标系
    );
    return result[0].toFixed(6)+","+result[1].toFixed(6)
}
 
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

        var dataJSON = JSON.parse(data)
        var car_id = dataJSON.id
        var response = {}
        var promiseArr = []

        const setBasicValue = () => {
            return new Promise( (resolve) => {
                    connection.query('update car_info set location=?,car_state=?,box_state=?,open_state=? where car_id=?',
                                    [dataJSON.location,dataJSON.state,dataJSON.boxState,dataJSON.openState,dataJSON.id],
                                    function(err,result){
                                        resolve(result.message)
                                    })
                })
        }

        //获取数据库中的operation字段
        const getOperationField = () => {
            return new Promise( (resolve) =>{
                connection.query('select operation from car_info where car_id=?',
                                    [dataJSON.id],
                                    function(err,result){
                                        resolve(result[0]["operation"])
                                    })
            })
        }

        //清空数据库中的operation字段
        const clearOperationField = () => {
            return new Promise((resolve) => {
                        connection.query('update car_info set operation=? where car_id=?',
                                            ["",dataJSON.id],
                                            function(err,result){
                                                resolve(result)
                                            })
                    })
        }

        //获取数据库中的小车对应的order_id
        const getOrderIdField = (car_id) => {
            return new Promise((resolve) => {
                    connection.query('select order_id from car_info where car_id=?',
                                        [car_id],
                                        function(err,result){
                                            //查询结果是符合要求的数组
                                            //每个数组元素是一个对象，键名是查询的字段
                                            resolve(result[0]["order_id"])
                                        })
            })
        }
        //获取数据库中的小车的实时位置
        const getLocationField = (car_id) => {
            return new Promise((resolve) => {
                    connection.query('select location from car_info where car_id=?',
                                        [car_id],
                                        function(err,result){
                                            //查询结果是符合要求的数组
                                            //每个数组元素是一个对象，键名是查询的字段
                                            resolve(result[0]["location"])
                                        })
            })
        }
        //获取数据库中的order详情
        const getOrderInfo = (order_id) => {
            return new Promise((resolve) => {
                     connection.query('select * from order_info where order_id=?',
                                        [order_id],
                                        function(err,result){
                                            resolve(result[0])
                                        })
            })
        }
        //根据起点和终点获取路径规划
        const getPath = (orgin,target) => {
            return new Promise((resolve) => {
                const url = `http://api.map.baidu.com/direction/v2/riding?origin=${orgin}&destination=${target}&ak=DZCFNOhzbvyd1HK2k4MXCodfUqUgChm5`
                request(url,function(error,response,body){
                        if(!error && response.statusCode == 200){
                            // console.log(body);
                            resolve(body) 
                        }else{
                            // console.log("error!!")
                            resolve("error") 
                        }
                })
            })
        }
        //处理从百度api获取到的路径规划，返回路径数组
        const returnPathInfo=(body) => {
            var resultMessage = JSON.parse(body)
            var pathInfos=[]
            for(let item of resultMessage.result.routes[0].steps){
                var path=[]
                for(let value of item.path.split(";")){
                    path.push(transform(value))
                }
                pathStr=path.join(";")
                var turn=""
                if(item.turn_type=="左转"){
                    turn="left"
                }else if(item.turn_type=="右转"){
                    turn="right"
                }else{
                    turn=""
                }
                pathInfos.push({
                    "direction":String(item.direction),
                    "distance":String(item.distance),
                    "path":pathStr,
                    "turn_type":turn
                })
            }
            return pathInfos
        }

        const dealBasicField = async () => {
            // 首先判断是否具有基础字段
            // 若存在，则更新数据库
            if(dataJSON.hasOwnProperty("location") &&
                dataJSON.hasOwnProperty("id") &&
                dataJSON.hasOwnProperty("state") &&
                dataJSON.hasOwnProperty("boxState") &&
                dataJSON.hasOwnProperty("openState")){
                response["success"] = "ok"
                const updateResult = await setBasicValue()
                console.log("updateBasicInfo:"+updateResult)
            }else{
                response["success"] = "fail"
                console.log("updateBasicInfo:fail")
            }
        }

        const dealControl = async () => {
            const operationField = await getOperationField()
            if(operationField){
                response["operation"]=operationField
                await clearOperationField()
            }
        }

        const dealRequest = async () => {
            if(dataJSON.hasOwnProperty("request")){
                var name = dataJSON.request.name
                if(name == "getOrder"){
                    //构造pathInfo返回
                    const orderStr = await getOrderIdField(dataJSON.id)
                    //将字符串数组转变成数组
                    const orderArr = eval(orderStr)
                    const orders = []
                    let lastDes = ""
                    //查找出订单数组中的所有详细信息
                    for(let i = 0,len = orderArr.length;i < len ;i++){
                        const order = await getOrderInfo(orderArr[i])
                        orders.push(order)
                    }
                    //根据每个order构造response
                    for(let i = 0,len = orders.length;i < len ;i++){
                        let pathInfo = []
                        let nowOrder = orders[i]
                        if(lastDes==""){
                            pathInfo = returnPathInfo(await getPath(nowOrder.startPoint,nowOrder.endPoint))
                            lastDes = nowOrder.endPoint
                        }else{
                            pathInfo = returnPathInfo(await getPath(lastDes,nowOrder.endPoint))
                            lastDes = nowOrder.endPoint
                        }
                        if(!response["order"]){
                            response["order"]=[]
                        }
                        let returnOrder = {
                                        "phoneNumber":nowOrder.phoneNumber,
                                        "code":nowOrder.authCode,
                                        "msg":"您的外卖已经到达XXX，验证码为"+nowOrder.authCode,
                                        "boxId":String(nowOrder.box_id),
                                        "pathInfo":await pathInfo
                                    }
                        response["order"].push(returnOrder)
                    }
                }else if(name == "return"){
                    const nowLocation = await getLocationField(dataJSON.id)
                    const des = "30.522430,114.362275"
                    const movePath = returnPathInfo(await getPath(nowLocation,des))
                    response["response"] = {
                        "name":"response",
                        "movePath":movePath
                    }
                }
            }
        }
        async function Init(){
            await dealBasicField()
            await dealControl()
            await dealRequest()
            sock.write(JSON.stringify(response))
        }
        Init()
    });
 
    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
 
}).listen(PORT, HOST);
 
console.log('Server listening on ' + HOST +':'+ PORT);