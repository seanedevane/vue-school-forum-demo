import { findById, docToResource, makeAppendChildToParentMutation } from '@/helpers'
import firebase from 'firebase'
export default {
  state: {
    items: [] // requires using state.items to go to the module, and state.thread.threads (by default, but can be changed). Named items here to avoid that confusion.
  },
  getters: {
    thread: state => {
      return (id) => {
        const thread = findById(state.items, id)
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
      return findById(state.items, threadRef.id)
    },
    async updateThread ({ commit, state }, { text, title, id }) {
      const thread = findById(state.items, id)
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
    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, logMsg: 'thread' }),
    fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, logMsg: 'threads' })

  },
  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })

  }
}
