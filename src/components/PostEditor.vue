<template>
  <div class="col-full">
    <VeeForm @submit="save" :key="formKey">
      <BaseFormField v-model="postCopy.text" name="text" rules="required" as="textarea" rows="10" cols="30" />
      <button class="btn-blue">{{ post.id ? 'Update Post' : 'Submit Post' }}</button>
    </VeeForm>
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
      postCopy: { ...this.post },
      // helps vee-validate reload on a new submission so it doesn't automatically display a validation error
      formKey: Math.random()
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy }) // use an object here to access based on keys, no need to know the order.
      this.postCopy.text = ''
      this.formKey = Math.random()
    }
  }
}
</script>

<style scoped>
</style>
