const gcoord = require('gcoord');


var result = gcoord.transform(
  [103.485395, 30.40057],    // 经纬度坐标
  gcoord.WGS84,               // 当前坐标系
  gcoord.BD09                 // 目标坐标系
);
var result2 = gcoord.transform(
  [114.2307469, 29.5790798],    // 经纬度坐标
  gcoord.BD09,               // 当前坐标系
  gcoord.WGS84                 // 目标坐标系
);

console.log(result)
console.log(result2)