<template>
  <VueFinalModal v-model="showModal" classes="modal-container" content-class="modal">
    <div class="modal-content">
      <h4>Login again to change your email</h4>
      <VeeForm @submit="reauthenticate">
        <BaseFormField name="reauth-email" label="Email" v-model="email" rules="email" type="email" />
        <BaseFormField name="reauth-password" label="Password" v-model="password" type="password" />
        <button class="btn btn-green btn-small">Login</button>
      </VeeForm>
    </div>
  </VueFinalModal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'
export default {
  components: {
    VueFinalModal
  },
  props: {
    modalValue: { type: Boolean, default: false }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    showModal: {
      get () {
        return this.modalValue
      },
      set (value) {
        this.$emit('update:modalValue', value)
      }
    }
  },
  methods: {
    async reauthenticate () {
      try {
        await this.$store.dispatch('auth/reauthenticate', { email: this.email, password: this.password })
        this.$emit('success')
      } catch (error) {
        this.$emit('fail', error)
      }
    }
  }
}
</script>

<style>

</style>
