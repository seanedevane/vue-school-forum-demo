import PageHome from '@/pages/PageHome'
import PageNotFound from '@/pages/PageNotFound'
import PageThreadShow from '@/pages/PageThreadShow'
import PageForum from '@/pages/PageForum'
import PageCategory from '@/pages/PageCategory'
import { createRouter, createWebHistory } from 'vue-router'
import sourceData from '@/data.json'
// Define route components
// Based on documentation from router.vuejs.org
const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: PageCategory,
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: PageForum,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: PageThreadShow,
    props: true,
    beforeEnter (to, from) {
      // check if the thread ID exists
      // to.params is how route guards expose the params of any route
      const threadExists = sourceData.threads.find(thread => thread.id === to.params.id)
      if (threadExists && to.name !== 'PageNotFound') {
      // exists, so continue as normal
      } else {
        // if it doesn't redirect to PageNotFound
        return {
          name: 'PageNotFound',
          // shows you the URL entered before being re-routed.
          params: { pathMatch: to.path.substring(1).split('/') },
          // preserve existing query and hash values on an entered URL
          query: to.query,
          hash: to.hash
        }
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
