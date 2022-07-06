import { createStore } from 'vuex'
import { findById, upsert } from '@/helpers'
import firebase from 'firebase'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          // the get function below allows for you to access the below as props, like autUser.posts
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          get postCount () {
            return this.posts.length
          },
          get threads () {
            return state.threads.filter(thread => thread.userId === user.id)
          },
          get threadCount () {
            return this.threads.length
          }
        }
      }
    },
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)
        if (!thread) return {}
        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get countributorsCount () {
            return thread.contributors?.length
          }
        }
      }
    }
  },
  actions: {
    async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      const id = 'ggqq' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setItem', { resource: 'threads', item: thread })
      commit('appendThreadToForum', { parentId: forumId, childId: id })
      commit('appendThreadToUser', { parentId: userId, childId: id })
      dispatch('createPost', { text, threadId: id })
      return findById(state.threads, id)
    },
    async updateThread ({ commit, state }, { text, title, id }) {
      const thread = findById(state.threads, id)
      console.log('In updateThread' + thread)
      const post = findById(state.posts, thread.posts[0])
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setItem', { resource: 'threads', item: newThread })
      commit('setItem', { resource: 'posts', item: newPost })
      return newThread
    },
    createPost ({ commit, state }, post) {
      post.id = 'gggg' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setItem', { resource: 'posts', item: post })// sets the post
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId })// append post to thread
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
    },
    updateUser ({ commit }, user) {
      commit('setItem', { resource: 'users', item: user.id })
    },
    // fetch alls
    fetchAllCategories ({ commit }) {
      console.log('Loading all categories')
      return new Promise((resolve) => {
        firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data() }
            commit('setItem', { resource: 'categories', item })
            return item
          })
          resolve(categories)
        })
      })
    },
    // fetch singles
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id, logMsg: 'user' })
    },
    fetchCategory ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'categories', id, logMsg: 'category' })
    },
    fetchForum ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'forums', id, logMsg: 'forum' })
    },
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id, logMsg: 'thread' })
    },
    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id, logMsg: 'post' })
    },
    // fetch multiples
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids, logMsg: 'users' })
    },
    fetchCategories ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'categories', ids, logMsg: 'categories' })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids, logMsg: 'forums' })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'threads', ids, logMsg: 'threads' })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids, logMsg: 'posts' })
    },
    // generic action
    fetchItem ({ state, commit }, { id, logMsg, resource }) {
      console.log('Firebase ' + logMsg + ' id ' + id)
      return new Promise((resolve) => {
        firebase.firestore().collection(resource).doc(id).onSnapshot(doc => {
          const item = { ...doc.data(), id: doc.id }
          commit('setItem', { resource, id, item })
          resolve(item)
        })
      })
    },
    fetchItems ({ dispatch }, { ids, resource, logMsg }) {
      return Promise.all(ids.map(id => this.dispatch('fetchItem', { id, resource, logMsg })))
    }
  },
  mutations: {
    // generic mutation
    setItem (state, { resource, item }) {
      upsert(state[resource], item)
    },
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource.posts = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource.posts.push(childId)
    }
  }
}
