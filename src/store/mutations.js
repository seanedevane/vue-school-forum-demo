import { upsert, docToResource, makeAppendChildToParentMutation } from '@/helpers'
export default {
  // generic mutation
  setItem (state, { resource, item }) {
    upsert(state[resource], docToResource(item))
  },
  setAuthId (state, id) {
    state.authId = id
  },
  setAuthUserUnsubscribe (state, unsubscribe) {
    state.authUserUnsubscribe = unsubscribe
  },
  setAuthObserverUnsubscribe (state, unsubscribe) {
    state.authUserUnsubscribe = unsubscribe
  },
  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
  },
  clearAllUnsubscribes (state) {
    state.unsubscribes = []
  },
  appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
  appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' })
}
