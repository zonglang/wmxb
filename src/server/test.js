var axios = require('axios');
// const getPath = () => {
//     return 
// }
// getPath()

// new Promise((resolve) => {
        
//    }).then(result => console.log(result))

const url = "http://api.map.baidu.com/direction/v2/riding?origin=30.517362,114.350067&destination=30.51828,114.351513&ak=DZCFNOhzbvyd1HK2k4MXCodfUqUgChm5"

axios.get(url,{
	headers:{
		"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36",
		"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
		"Cookie":"BAIDUID=114D761B8C75F63C381FD2D7F4E9B075:FG=1; BIDUPSID=114D761B8C75F63C381FD2D7F4E9B075; PSTM=1545042046; MCITY=-218%3A; BDUSS=hnfmY4dWV3fkJIRTFvdjd4TDZncGJyMTQteGt1SG5XeFFwQmdnMk5ZMkVGYU5jQVFBQUFBJCQAAAAAAAAAAAEAAACsIfFG193AyzIzMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAISIe1yEiHtcaF; H_PS_PSSID=1441_21117_28557_28607_28584_28638_26350_28626_28605"
	}
})
.then(response => {
console.log(response.data)
})
.catch(error => {
console.log(error);
});