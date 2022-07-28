import firebase from '@/helpers/firebase'
import { findById } from '@/helpers'
export default {
  // generic actions
  fetchItem ({ state, commit }, { id, logMsg, resource, handleUnsubscribe = null, once = false, onSnapshot = null }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot(doc => {
        if (once) {
          unsubscribe()
        }
        if (doc.exists) {
          const item = { ...doc.data(), id: doc.id }
          let previousItem = findById(state[resource].items, id)
          previousItem = previousItem ? { ...previousItem } : null
          commit('setItem', { resource, id, item })
          if (typeof onSnapshot === 'function') {
            const isLocal = doc.metadata.hasPendingWrites
            onSnapshot({ item: { ...item }, previousItem, isLocal })
          }
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
  fetchItems ({ dispatch }, { ids, resource, logMsg, onSnapshot = null }) {
    ids = ids || []
    return Promise.all(ids.map(id => this.dispatch('fetchItem', { id, resource, logMsg, onSnapshot })))
  },
  clearItems ({ commit }, { modules = [] }) {
    commit('clearItems', { modules })
  },
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  }
}
