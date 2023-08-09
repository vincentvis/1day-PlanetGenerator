import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/presentation',
      name: 'presentation',
      component: () => import('../views/presentation.vue')
    },
    {
      path: '/generator',
      name: 'generator',
      component: () => import('../views/Generator.vue')
    },
    {
      path: '/final',
      name: 'final',
      component: () => import('../views/Final.vue')
    }
  ]
})

export default router
