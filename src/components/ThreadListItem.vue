<template>
    <div class="thread">
        <div>
            <p>
        <a href="#">{{thread.title}}</a>
            </p>
        <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a>, {{thread.publishedAt}}.
        </p>
        </div>

        <div class="activity">
            <p class="replies-count">
                {{ thread.posts.length - 1 }} replies
            </p>

        <img class="avatar-medium" :src="userById(thread.userId).avatar" alt="">

        <div>
        <p class="text-xsmall">
            <a href="profile.html">{{ userById(thread.userId).name }}</a>
        </p>
        <p class="text-xsmall text-faded">{{ thread.publishedAt}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import sourceData from '@/data.json'
export default {
  props: {
    thread: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  methods: {
    postById (postId) {
      return this.posts.find(p => p.id === postId)
    },
    userById (userId) {
      return this.users.find(p => p.id === userId)
    }
  }
}
</script>

<style scoped>

</style>
