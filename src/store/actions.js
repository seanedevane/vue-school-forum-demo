import firebase from 'firebase'
import { docToResource } from '@/helpers'

export default {
  initAuthentication ({ dispatch, commit, state }) {
    if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
    return new Promise((resolve) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        console.log('the user has changed')
        dispatch('unsubscribeAuthUserSnapshot')
        if (user) {
          await dispatch('fetchAuthUser')
          resolve(user)
        } else {
          resolve(null)
        }
      })
      commit('setAuthObserverUnsubscribe', unsubscribe)
    })
  },
  async registerUserWithEmailAndPassword ({ dispatch }, { avatar = null, email, name, username, password }) {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
    dispatch('createUser', { id: result.user.uid, avatar, email, name, username })
  },
  async signInWithGoogle ({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    const response = await firebase.auth().signInWithPopup(provider)
    const user = response.user
    const userRef = firebase.firestore().collection('users').doc(user.uid)
    const userDoc = await userRef.get()
    if (!userDoc.exists) {
      return dispatch('createUser', { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL })
    }
  },
  async signInWithEmailAndPassword ({ context }, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  async signOut ({ commit }) {
    await firebase.auth().signOut()
    commit('setAuthId', null)
  },
  async createUser ({ commit }, { id, email, name, username, avatar = null }) {
    const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
    const usernameLower = username.toLowerCase()
    email = email.toLowerCase()
    const user = { id, avatar, email, name, username, usernameLower, registeredAt }
    const userRef = await firebase.firestore().collection('users').doc(id)
    userRef.set(user)
    const newUser = await userRef.get()
    commit('setItem', { resource: 'users', item: newUser })
    return docToResource(newUser)
  },
  async updateUser ({ commit }, user) {
    const updates = {
      avatar: user.avatar || null,
      username: user.username || null,
      name: user.name || null,
      bio: user.bio || null,
      website: user.website || null,
      email: user.email || null,
      location: user.location || null
    }
    const userRef = firebase.firestore().collection('users').doc(user.id)
    await userRef.update(updates)
    commit('setItem', { resource: 'users', item: user.id })
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
  async fetchAuthUsersPosts ({ commit, state }) {
    const posts = await firebase.firestore().collection('posts').where('userId', '==', state.authId).get()
    posts.forEach(item => {
      commit('setItem', { resource: 'posts', item })
    })
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
  fetchAuthUser: async ({ dispatch, state, commit }) => {
    const userId = firebase.auth().currentUser?.uid
    if (!userId) return
    await dispatch('fetchItem', {
      logMsg: 'user',
      resource: 'users',
      id: userId,
      handleUnsubscribe: (unsubscribe) => {
        commit('setAuthUserUnsubscribe', unsubscribe)
      }
    })
    commit('setAuthId', userId)
  },
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, logMsg: 'category' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, logMsg: 'forum' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, logMsg: 'post' }),
  // fetch multiples
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, logMsg: 'users' }),
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, logMsg: 'categories' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, logMsg: 'forums' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, logMsg: 'posts' }),
  // generic action
  fetchItem ({ state, commit }, { id, logMsg, resource, handleUnsubscribe = null }) {
    console.log('Firebase ' + logMsg + ' id ' + id)
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot(doc => {
        if (doc.exists) {
          const item = { ...doc.data(), id: doc.id }
          commit('setItem', { resource, id, item })
          resolve(item)
        } else {
          resolve(null)
        }
      })
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },
  fetchItems ({ dispatch }, { ids, resource, logMsg }) {
    return Promise.all(ids.map(id => this.dispatch('fetchItem', { id, resource, logMsg })))
  },
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  },
  async unsubscribeAuthUserSnapshot ({ state, commit }) {
    if (state.authUserUnsubscribe) {
      state.authUserUnsubscribe()
      commit('setAuthUserUnsubscribe', null)
    }
  }
}
