<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}
    <router-link
      custom=""
      v-slot="{ navigate }"
      :to="{name: 'ThreadEdit', params: { id }}"
    >
    <button @click="navigate" role="link" class="btn-green btn-small">Edit Thread</button></router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a>, <BaseDate :timestamp="thread.publishedAt" />.
      <span style="float: right; margin-top: 2px;" class="hide-mobile text-faded text-small">
        {{ thread.repliesCount }} replies {{ thread.ContributorsCount }} contributors
      </span>
    </p>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />

  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { mapActions } from 'vuex'

export default {
  name: 'ThreadShow',
  components: {
    PostList,
    PostEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    // Store calls
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    }, // end store calls
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    ...mapActions(['createPost', 'fetchThread', 'fetchPosts', 'fetchUsers']),
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.createPost(post)
    }
  },
  async created () {
    // fetch the thread
    const thread = await this.fetchThread({ id: this.id })
    // fetch posts
    const posts = await this.fetchPosts({ ids: thread.posts })
    const users = posts.map(post => post.userId).concat(thread.userId)
    this.fetchUsers({ ids: users })
  }
}
</script>

<style scoped>

</style>
