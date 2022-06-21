<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id" class="post">
          <div class="user-info">
              <a href="#" class="user-name">{{userById(post.userId).name}}</a>

              <a href="#">
                  <img class="avatar-large" :src="userById(post.userId).avatar" alt="">
              </a>

              <p class="desktop-only text-small">107 posts</p>

              <p class="desktop-only text-small">23 threads</p>

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
import sourceData from '@/data.json'

export default {
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      threads: sourceData.threads,
      users: sourceData.users
    }
  },
  methods: {
    userById (userId) {
      return this.users.find(u => u.id === userId)
    }
  }
}
</script>

<style scoped>
</style>
