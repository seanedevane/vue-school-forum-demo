import { upsert, docToResource } from '@/helpers'
export default {
  // generic mutation
  setItem (state, { resource, item }) {
    upsert(state[resource].items, docToResource(item))
  },
  clearItems (state, { modules = [] }) {
    modules.forEach(module => {
      state[module].items = []
    })
  },
  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
  },
  clearAllUnsubscribes (state) {
    state.unsubscribes = []
  }
}
