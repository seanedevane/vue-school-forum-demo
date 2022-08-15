import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { findById } from '@/helpers'
// Define route components
// Based on documentation from router.vuejs.org
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */'@/pages/PageHome')
  },
  {
    path: '/me',
    name: 'AuthUserProfile',
    component: () => import(/* webpackChunkName: "Profile" */'@/pages/PageAuthUserProfile'),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: () => import(/* webpackChunkName: "Profile Edit" */'@/pages/PageAuthUserProfile'),
    props: { edit: true },
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import(/* webpackChunkName: "User Profile" */'@/pages/PageUserProfile'),
    props: true
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import(/* webpackChunkName: "Category" */'@/pages/PageCategory'),
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: () => import(/* webpackChunkName: "Forum" */'@/pages/PageForum'),
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: () => import(/* webpackChunkName: "ThreadShow" */'@/pages/PageThreadShow.vue'),
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
    component: () => import(/* webpackChunkName: "ThreadCreate" */'@/pages/PageThreadCreate'),
    props: true,
    meta: { requiresAuth: true }

  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import(/* webpackChunkName: "ThreadEdit" */'@/pages/PageThreadEdit'),
    props: true,
    meta: { requiresAuth: true }

  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "Register" */'@/pages/PageRegister'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "SignIn" */'@/pages/PageSignIn'),
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
    component: () => import(/* webpackChunkName: "NotFound" */'@/pages/PageNotFound')
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
router.afterEach(() => {
  store.dispatch('clearItems', { modules: ['categories', 'forums', 'threads', 'posts'] })
})

export default router
