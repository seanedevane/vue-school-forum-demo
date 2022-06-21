<template>
  <div class="col-full">
    <form @submit.prevent="save" >
      <textarea v-model="text" name="" id="" class="form-input" />
      <button class="btn-blue">Submit post</button>
    </form>
  </div>
</template>

<script>
import sourceData from '@/data.json'

export default {
  data () {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      text: ''
    }
  },
  methods: {
    save () {
      const postId = 'gggg' + Math.random()
      const post = {
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: 'FsCDAk9w8NeXEceLV87arpsXjnQ2'
      }
      this.$emit('save', { post }) // use an object here to access based on keys, no need to know the order.
      this.posts.push(post)
      this.thread.posts.push(postId)

      this.text = ''
    }
  }
}
</script>

<style scoped>
</style>
