import Vue from 'vue'
import Router from 'vue-router'
import searchLocation from '@/components/searchLocation'
import lushu from '@/components/lushu'
import createOrder from '@/components/createOrder'
import showLocation from '@/components/showLocation'
import showOrder from '@/components/showOrder'
import orderDetail from '@/components/orderDetail'
import showCarMap from '@/components/showCarMap'
import getPoint from '@/components/getPoint'
Vue.use(Router);

export default new Router({
	mode:"hash",
	routes:[
		{
		path:'/showLocation',
		component:showLocation
		},
		{
		path:'/getPoint',
		component:getPoint
		},
		{
		path:'/searchLocation',
		component:searchLocation
		},
		{
		path:'/showCarMap',
		component:showCarMap
		},
		{
		path:'/orderDetail',
		component:orderDetail
		},
		{
		path:'/showOrder',
		component:showOrder
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
