<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
      <BaseHead>
      <title>{{ thread?.title }}</title>
      <meta property="og:title" :content="thread?.title" />
      <meta name="twitter:title" :content="thread?.title" />
    </BaseHead>
    <h1>{{ thread.title }}
    <router-link
      v-if="thread.userId === authUser?.id"
      v-slot="{ navigate }"
      :to="{name: 'ThreadEdit', params: { id }}"
    >
    <button @click="navigate" role="link" class="btn-green btn-small">Edit Thread</button></router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a>, <BaseDate :timestamp="thread.publishedAt" />.
      <span style="float: right; margin-top: 2px;" class="hide-mobile text-faded text-small">
        {{ thread.repliesCount }} {{ thread.repliesCount === 1 ? 'reply' : 'replies' }} {{ thread.contributorsCount }} {{ thread.contributorsCount === 1 ? 'contributor' : 'contributors' }}
      </span>
    </p>
    <post-list :posts="threadPosts" />
    <post-editor v-if="authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $route.path } }">Sign In</router-link> or <router-link :to="{ name: 'Register', query: { redirectTo: $route.path } }">Register</router-link> to reply.
    </div>

  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { mapActions, mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import useNotifications from '@/composables/useNotifications'
import difference from 'lodash/difference'

export default {
  name: 'ThreadShow',
  components: {
    PostList,
    PostEditor
  },
  setup () {
    const { addNotification } = useNotifications()
    return { addNotification }
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters('auth', ['authUser']),
    // Store calls
    threads () {
      return this.$store.state.threads.items
    },
    posts () {
      return this.$store.state.posts.items
    }, // end store calls
    thread () {
      return this.$store.getters['threads/thread'](this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    ...mapActions('users', ['fetchUsers']),
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('posts', ['createPost', 'fetchPosts']),
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.createPost(post)
    },
    async fetchPostsWithUsers (ids, firstRun = false) {
      // fetch posts
      const posts = await this.fetchPosts({
        ids: ids,
        onSnapshot: ({ isLocal, previousItem }) => {
          if (!this.asyncDataStatus_ready || isLocal || firstRun || (previousItem?.edited && !previousItem?.edited?.at)) return
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      })
      const users = posts.map(post => post.userId).concat(this.thread.userId)
      await this.fetchUsers({ ids: users })
    }
  },
  async created () {
    // fetch the thread
    const thread = await this.fetchThread({
      id: this.id,
      onSnapshot: async ({ isLocal, item, previousItem }) => {
        if (isLocal || !this.asyncDataStatus_ready) return
        const newPosts = difference(item.posts, previousItem.posts)
        const hasNewPosts = newPosts.length > 0
        if (hasNewPosts) {
          await this.fetchPostsWithUsers(newPosts)
        } else {
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      }
    })
    this.fetchPostsWithUsers(thread.posts, { firstRun: true })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
