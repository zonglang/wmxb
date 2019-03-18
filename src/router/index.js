import Vue from 'vue'
import Router from 'vue-router'
import searchLocation from '@/components/searchLocation'
import lushu from '@/components/lushu'
import createOrder from '@/components/createOrder'
Vue.use(Router);

export default new Router({
	mode:"hash",
	routes:[
		{
		path:'/searchlocation',
		component:searchLocation
		},
		{
		path:'/createOrder',
		component:createOrder
		},
		{
		path:'/lushu',
		component:lushu
		},
		{
		path:'/',
		redirect: '/createOrder'
		},
	]
})
