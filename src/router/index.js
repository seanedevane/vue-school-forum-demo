import PageHome from '@/pages/PageHome'
import PageNotFound from '@/pages/PageNotFound'
import PageThreadShow from '@/pages/PageThreadShow'
import PageThreadCreate from '@/pages/PageThreadCreate'
import PageThreadEdit from '@/pages/PageThreadEdit'
import PageForum from '@/pages/PageForum'
import PageCategory from '@/pages/PageCategory'
import PageProfile from '@/pages/PageProfile'
import PageRegister from '@/pages/PageRegister'
import PageSignIn from '@/pages/PageSignIn'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { findById } from '@/helpers'
// Define route components
// Based on documentation from router.vuejs.org
const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  },
  {
    path: '/me',
    name: 'Profile',
    component: PageProfile,
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: PageProfile,
    props: { edit: true },
    meta: { requiresAuth: true }
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
    async beforeEnter (to, from) {
      await store.dispatch('threads/fetchThread', { id: to.params.id, once: true })
      // check if the thread ID exists
      // to.params is how route guards expose the params of any route
      const threadExists = findById(store.state.threads.items, to.params.id)
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
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: PageThreadCreate,
    props: true,
    meta: { requiresAuth: true }

  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: PageThreadEdit,
    props: true,
    meta: { requiresAuth: true }

  },
  {
    path: '/register',
    name: 'Register',
    component: PageRegister,
    meta: { requiresGuest: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: PageSignIn,
    meta: { requiresGuest: true }
  },
  {
    path: '/logout',
    name: 'SignOut',
    async beforeEnter () {
      await store.dispatch('auth/signOut')
      return { name: 'Home' }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // look at specific routes and apply scroll behavior changes to them including scroll to top and smooth animations
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})
router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeAllSnapshots')
  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } }
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
})

export default router
