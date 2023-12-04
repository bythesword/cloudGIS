import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import('../views/home.vue')
  }
  ,
  {
    path: '/a',
    name: '/a',
    component: () => import('../views/a.vue')
  },
  {
    path: '/b',
    name: '/b',
    component: () => import('../views/b.vue')
  },
  {
    path: '/CNWCM',
    name: '/CNWCM',
    component: () => import('../views/sjh/CNWCM.vue')
  },
  {
    path: '/test1',
    name: '/test1',
    component: () => import('../views/sjh/test1.vue')
  },
  {
    path: '/test2',
    name: '/test2',
    component: () => import('../views/sjh/test2.vue')
  },
  {
    path: '/tom_POI_1',
    name: '/tom_POI_1',
    component: () => import('../views/sjh/poi1.vue')
  },
  {
    path: '/tom_POI_IMG1',
    name: '/tom_POI_IMG1',
    component: () => import('../views/sjh/poiIMG1.vue')
  },
  {
    path: '/tom_CCMSNW_1',
    name: '/tom_CCMSNW_1',
    component: () => import('../views/sjh/tom_CCMSNW_1.vue')
  }, 
  {
    path: '/tom_CCMSNW_2',
    name: '/tom_CCMSNW_2',
    component: () => import('../views/sjh/tom_CCMSNW_2.vue')
  }, 
  {
    path: '/tom_CCMSNW_3',
    name: '/tom_CCMSNW_3',
    component: () => import('../views/sjh/tom_CCMSNW_3.vue')
  }, 
  {
    path: '/tom_CCMSNW_4',
    name: '/tom_CCMSNW_4',
    component: () => import('../views/sjh/tom_CCMSNW_4.vue')
  }, 
   {
    path: '/tom_DCCommand_1',
    name: '/tom_DCCommand_1',
    component: () => import('../views/sjh/tom_DCCommand_1.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
