import { makeAppendChildToParentMutation, makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchForum: makeFetchItemAction({ logMsg: 'forum', resource: 'forums' }),
    fetchForums: makeFetchItemsAction({ logMsg: 'forums', resource: 'forums' })
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })

  }
}
