<template>
  <div v-if="threadLoaded" class="col-full push-top">

      <div class="forum-header">
          <div class="forum-details">
              <h1>{{ forum.name }}</h1>
              <p class="text-lead">{{ forum.description }}</p>
          </div>
          <router-link :to="{name: 'ThreadCreate', params: { forumId: forum.id }}" class="btn-green btn-small">Start a thread</router-link>
      </div>
  </div>

  <div class="col-full">

  </div>

  <div class="col-full push-top">

    <ThreadList :threads="threads" />
  </div>
</template>

<script>
import { findById } from '@/helpers'
import ThreadList from '@/components/ThreadList'

export default {
  components: {
    ThreadList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      threadLoaded: false
    }
  },
  computed: {
    forum () {
      return findById(this.$store.state.forums, this.id)
    }
    // threads () {
    //   if (!this.forum) return []
    //   return this.forum.threads.map(threadId => this.$store.getters.thread(threadId).filter(thread => thread.id))
    // }
  },
  async created () {
    const forum = await this.$store.dispatch('fetchForum', this.id)
    const threads = await this.$store.dispatch('fetchThreads', { ids: forum.threads })
    await this.$store.dispatch('fetchUsers', { ids: threads.map(thread => thread.userId) })
    this.threads = forum.threads.map(threadId =>
      this.$store.getters.thread(threadId)
    )
    this.threadLoaded = true
  }
}
</script>

<style scoped>
</style>
