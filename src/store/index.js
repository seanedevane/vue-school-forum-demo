import { createStore } from 'vuex'
import sourceData from '@/data.json'

export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: state => {
      const user = state.users.find(user => user.id === state.authId)
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
  actions: {
    async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      const id = 'ggqq' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setThread', { thread })
      commit('appendThreadToForum', { forumId, threadId: id })
      commit('appendThreadToUser', { userId, threadId: id })
      dispatch('createPost', { text, threadId: id })
      return state.threads.find(thread => thread.id === id)
    },
    createPost ({ commit, state }, post) {
      post.id = 'gggg' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post })// sets the post
      commit('appendPostToThread', { postId: post.id, threadId: post.threadId })// append post to thread
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    }
  },
  mutations: {
    setThread (state, { thread }) {
      state.threads.push(thread)
    },
    setPost (state, { post }) {
      state.posts.push(post)
    },
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(user => user.id === userId)
      state.users[userIndex] = user
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find(thread => thread.id === threadId)
      thread.posts = thread.posts || []
      thread.posts.push(postId)
    },
    appendThreadToForum (state, { forumId, threadId }) {
      const forum = state.forums.find(forum => forum.id === forumId)
      forum.threads = forum.threads || []
      forum.threads.push(threadId)
    },
    appendThreadToUser (state, { userId, threadId }) {
      const user = state.users.find(user => user.id === userId)
      user.threads = user.threads || []
      user.threads.push(threadId)
    }
  }
})
