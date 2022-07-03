<template>
  <div class="col-full">
    <form @submit.prevent="save" >
      <textarea v-model="text" name="" id="" class="form-input" />
      <button class="btn-blue">Submit post</button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: ''
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
      const post = {
        text: this.text
      }
      this.$emit('save', { post }) // use an object here to access based on keys, no need to know the order.
      this.text = ''
    }
  }
}
</script>

<style scoped>
</style>
