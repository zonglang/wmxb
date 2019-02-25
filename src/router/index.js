import Vue from 'vue'
import Router from 'vue-router'
import searchLocation from '@/components/searchLocation'
import lushu from '@/components/lushu'
Vue.use(Router);

export default new Router({
	mode:"hash",
	routes:[
		{
		path:'/searchlocation',
		component:searchLocation
		},
		{
		path:'/lushu',
		component:lushu
		},
		{
		path:'/',
		redirect: '/searchlocation'
		},
	]
})
