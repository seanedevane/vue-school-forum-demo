<template>
    <div class="thread">
        <div>
            <p>
        <router-link v-if="thread.id" :to="{name: 'ThreadShow', params: {id: thread.id}}">{{thread.title}}</router-link>
            </p>
        <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a>, <BaseDate :timestamp="thread.publishedAt" />.
        </p>
        </div>

        <div class="activity">
            <p class="replies-count">
                {{ thread.repliesCount }} replies
            </p>

        <BaseAvatarImg class="avatar-medium" :src="userById(thread.userId).avatar" alt="" />

        <div>
        <p class="text-xsmall">
            <a href="profile.html">{{ userById(thread.userId).name }}</a>
        </p>
        <p class="text-xsmall text-faded"> <BaseDate :timestamp="thread.publishedAt" /></p>
            </div>
        </div>
    </div>
</template>

<script>
import { findById } from '@/helpers'
export default {
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  computed: {
    posts () {
      return this.$store.state.posts.items
    },
    users () {
      return this.$store.state.users.items
    }
  },
  methods: {
    postById (postId) {
      return findById(this.posts, postId)
    },
    userById (userId) {
      return findById(this.users, userId) || {}
    }
  }
}
</script>

<style scoped>

</style>
