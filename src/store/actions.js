import firebase from 'firebase'
import { findById } from '@/helpers'

export default {
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user.id })
  },
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
  fetchUser: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'users', id, logMsg: 'user' }),
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, logMsg: 'category' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, logMsg: 'forum' }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, logMsg: 'thread' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, logMsg: 'post' }),
  // fetch multiples
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, logMsg: 'users' }),
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, logMsg: 'categories' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, logMsg: 'forums' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, logMsg: 'threads' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, logMsg: 'posts' }),
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
}
