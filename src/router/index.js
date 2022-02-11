import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
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
  },
  {
    path: '/three4',
    name: 'Three4',
    component: () => import('../views/Three4.vue')
  },
  {
    path: '/three5',
    name: 'Three5',
    component: () => import('../views/Three5.vue')
  },
  {
    path: '/three6',
    name: 'Three6',
    component: () => import('../views/Three6.vue')
  },
  {
    path: '/three7',
    name: 'Three7',
    component: () => import('../views/Three7.vue')
  },
  {
    path: '/three8',
    name: 'Three8',
    component: () => import('../views/Three8.vue')
  },
  {
    path: '/three9',
    name: 'Three9',
    component: () => import('../views/Three9.vue')
  },
  {
    path: '/three10',
    name: 'Three10',
    component: () => import('../views/Three10.vue')
  },
  {
    path: '/three11',
    name: 'Three11',
    component: () => import('../views/Three11.vue')
  },
  {
    path: '/three12',
    name: 'Three12',
    component: () => import('../views/Three12.vue')
  },
  {
    path: '/three13',
    name: 'Three13',
    component: () => import('../views/Three13.vue')
  },
  {
    path: '/three14',
    name: 'Three14',
    component: () => import('../views/Three14.vue')
  },
  {
    path: '/three15',
    name: 'Three15',
    component: () => import('../views/Three15.vue')
  },
  {
    path: '/study',
    name: 'Study',
    component: () => import('../views/study/index.vue'),
    children: [
      {
        path: 't1',
        component: () => import('../views/study/t1.vue')
      },
      {
        path: 't2',
        component: () => import('../views/study/t2.vue')
      },
      {
        path: 't3',
        component: () => import('../views/study/t3.vue')
      },
      {
        path: 't4',
        component: () => import('../views/study/t4.vue')
      },
      {
        path: 't5',
        component: () => import('../views/study/t5.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
