import PageHome from '@/components/PageHome'
import PageThreadShow from '@/components/PageThreadShow'
import { createRouter, createWebHistory } from 'vue-router'

// Define route components
// Based on documentation from router.vuejs.org
const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: PageThreadShow,
    props: true
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
