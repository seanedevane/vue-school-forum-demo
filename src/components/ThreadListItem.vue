<template>
    <div class="thread">
        <div>
            <p>
        <router-link :to="{name: 'ThreadShow', params: {id: thread.id}}">{{thread.title}}</router-link>
            </p>
        <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a>, <BaseDate :timestamp="thread.publishedAt" />.
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
        <p class="text-xsmall text-faded"> <BaseDate :timestamp="thread.publishedAt" /></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  computed: {
    posts () {
      return this.$store.state.posts
    },
    users () {
      return this.$store.state.users
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
