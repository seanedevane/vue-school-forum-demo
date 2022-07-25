import firebase from 'firebase'
export default {
  // generic actions
  fetchItem ({ state, commit }, { id, logMsg, resource, handleUnsubscribe = null, once = false }) {
    console.log('Firebase ' + logMsg + ' id ' + id)
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot(doc => {
        if (once) {
          unsubscribe()
        }
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
  }
}
