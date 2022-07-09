import firebase from 'firebase'
import { findById, docToResource } from '@/helpers'

export default {
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user.id })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const userId = state.authId
    const publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const threadRef = firebase.firestore().collection('threads').doc()
    const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
    const userRef = firebase.firestore().collection('users').doc(userId)
    const forumRef = firebase.firestore().collection('forums').doc(forumId)
    const batch = firebase.firestore().batch()
    batch.set(threadRef, thread)
    batch.update(userRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    batch.update(forumRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    await batch.commit()
    const newThread = await threadRef.get()
    commit('setItem', { resource: 'threads', item: { ...newThread.data() }, id: newThread.id })
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
    commit('appendThreadToUser', { parentId: userId, childId: threadRef.id })
    await dispatch('createPost', { text, threadId: threadRef.id })
    return findById(state.threads, threadRef.id)
  },
  async updateThread ({ commit, state }, { text, title, id }) {
    const thread = findById(state.threads, id)
    console.log('In updateThread' + thread)
    const post = findById(state.posts, thread.posts[0])
    let newThread = { ...thread, title }
    let newPost = { ...post, text }
    const threadRef = firebase.firestore().collection('threads').doc(id)
    const postRef = firebase.firestore().collection('posts').doc(post.id)
    const batch = firebase.firestore().batch()
    batch.update(threadRef, newThread)
    batch.update(postRef, newPost)
    newThread = await threadRef.get()
    newPost = await postRef.get()
    await batch.commit()
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return docToResource(newThread)
  },
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const batch = firebase.firestore().batch()
    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
    const userRef = firebase.firestore().collection('users').doc(state.authId)
    batch.set(postRef, post)
    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1)
    })
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    await batch.commit()
    const newPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } })// sets the post
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId })// append post to thread
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async updatePost ({ commit, state }, { text, id }) {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        moderated: false
      }
    }
    const postRef = firebase.firestore().collection('posts').doc(id)
    await postRef.update(post)
    const updatedPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: updatedPost })
  },
  // fetch alls
  fetchAllCategories ({ commit }) {
    console.log('Loading all categories')
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = { id: doc.id, ...doc.data() }
          commit('setItem', { resource: 'categories', item })
          return item
        })
        resolve(categories)
      })
      commit('appendUnsubscribe', { unsubscribe })
    })
  },
  // fetch singles
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, logMsg: 'user' }),
  fetchAuthUser: ({ dispatch, state }) => dispatch('fetchUser', { id: state.authId }),
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
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot(doc => {
        const item = { ...doc.data(), id: doc.id }
        commit('setItem', { resource, id, item })
        resolve(item)
      })
      commit('appendUnsubscribe', { unsubscribe })
    })
  },
  fetchItems ({ dispatch }, { ids, resource, logMsg }) {
    return Promise.all(ids.map(id => this.dispatch('fetchItem', { id, resource, logMsg })))
  },
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  }
}
