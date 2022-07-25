import firebase from 'firebase'
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: makeFetchItemAction({ logMsg: 'category', resource: 'categories' }),
    fetchCategories: makeFetchItemsAction({ logMsg: 'categories', resource: 'categories' }),
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
        // TODO: this unsubscribe may be unnecessary now, not showing in current source.
        commit('appendUnsubscribe', { unsubscribe }, { root: true })
      })
    }
  },
  mutations: {}
}
