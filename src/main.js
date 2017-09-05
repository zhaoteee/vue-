import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import goods from 'components/goods/goods'
import seller from 'components/seller/seller'
import ratings from 'components/ratings/ratings'
import './common/stylus/index.styl'

Vue.use(VueRouter)
Vue .use(VueResource)

const router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  base: 'dist',
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
        path: '/goods',
        component: goods
    }, {
        path: '/ratings',
        component: ratings
    }, {
        path: '/seller',
        component: seller
    }
  ]
})

const app = new Vue({
	router: router,
	render: h => h(App)
}).$mount('#app')

//router.push('/goods')
export default app
