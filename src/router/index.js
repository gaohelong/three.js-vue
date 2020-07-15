import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/three',
    name: 'Three',
    component: () => import(/* webpackChunkName: "about" */ '../views/Three.vue')
  },
  {
    path: '/three1',
    name: 'Three1',
    component: () => import('../views/Three1.vue')
  },
  {
    path: '/three2',
    name: 'Three2',
    component: () => import('../views/Three2.vue')
  },
  {
    path: '/three3',
    name: 'Three3',
    component: () => import('../views/Three3.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
