import RedirectView from '@/views/RedirectView.vue'
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
      path: '/:shortCode',
      name: 'redirect',
      component: RedirectView
    }
  ]
})

export default router
