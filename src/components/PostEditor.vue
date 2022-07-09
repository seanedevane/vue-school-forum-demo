<template>
  <div class="col-full">
    <form @submit.prevent="save" >
      <textarea v-model="postCopy.text" name="" id="" class="form-input" />
      <button class="btn-blue">{{ post.id ? 'Update Post' : 'Submit Post' }}</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => ({ text: null })
    }
  },
  data () {
    return {
      postCopy: { ...this.post }
    }
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy }) // use an object here to access based on keys, no need to know the order.
      this.postCopy.text = ''
    }
  }
}
</script>

<style scoped>
</style>
