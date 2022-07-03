<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id" class="post">
          <div class="user-info">
              <a href="#" class="user-name">{{userById(post.userId).name}}</a>

              <a href="#">
                  <img class="avatar-large" :src="userById(post.userId).avatar" alt="">
              </a>

              <p class="desktop-only text-small">{{ userById(post.userId).postCount }} posts</p>

              <p class="desktop-only text-small">{{ userById(post.userId).threadCount}} threads</p>

              <span class="online desktop-only">online</span>

          </div>

          <div class="post-content">
              <div>
                <p>
                  {{post.text}}
                </p>
              </div>
          </div>
          <div class="post-date text-faded">
              <BaseDate :timestamp="post.publishedAt" />
          </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    userById (userId) {
      return this.$store.getters.user(userId)
    }
  }
}
</script>

<style scoped>
</style>
