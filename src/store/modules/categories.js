import firebase from 'firebase'
export default {
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, logMsg: 'category' }),
    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, logMsg: 'categories' }),
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
    }
  },
  mutations: {}
}
