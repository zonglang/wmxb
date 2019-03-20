const gcoord = require('gcoord');

var item = []
result=gcoord.transform(
			[114.33107,30.51350],
			gcoord.WGS84,
			gcoord.BD09
		)
console.log(result)