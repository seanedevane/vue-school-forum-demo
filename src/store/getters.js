import { findById } from '@/helpers'
export default {
  authUser: (state, getters) => {
    return getters.user(state.authId)
  },
  user: state => {
    return (id) => {
      const user = findById(state.users, id)
      if (!user) return null
      return {
        ...user,
        // the get function below allows for you to access the below as props, like autUser.posts
        get posts () {
          return state.posts.filter(post => post.userId === user.id)
        },
        get postsCount () {
          return user.postsCount || 0
        },
        get threads () {
          return state.items.filter(thread => thread.userId === user.id)
        },
        get threadsCount () {
          return user.threads?.length || 0
        }
      }
    }
  }
}
