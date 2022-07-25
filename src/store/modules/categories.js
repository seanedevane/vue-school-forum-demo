import firebase from 'firebase'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, logMsg: 'category' }, { root: true }),
    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, logMsg: 'categories' }, { root: true }),
    fetchAllCategories ({ commit }) {
      console.log('Loading all categories')
      return new Promise((resolve) => {
        const unsubscribe = firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data() }
            commit('setItem', { resource: 'categories', item }, { root: true })
            return item
          })
          resolve(categories)
        })
        commit('appendUnsubscribe', { unsubscribe }, { root: true })
      })
    }
  },
  mutations: {}
}
