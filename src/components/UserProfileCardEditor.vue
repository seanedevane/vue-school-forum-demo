<template>
<div class="profile-card">
          <VeeForm @submit="save">
            <p class="text-center avatar-edit">
                <label for="avatar">
                <BaseAvatarImg
                  :src="activeUser.avatar"
                  :alt="`${user.name} profile picture`"
                  class="avatar-xlarge img-update"
                  />
                <div class="avatar-upload-overlay">
                  <BaseSpinner v-if="uploadingImage" color="white" />
                  <fa v-else icon="camera" size="3x" :style="{ color: 'white', opacity: '8'}" />
                </div>
                <input v-show="false" type="file" accepts="image/*" id="avatar" @change="handleAvatarUpload" />
                </label>
            </p>
            <UserProfileCardEditorRandomAvatar @hit="activeUser.avatar = $event" />
            <BaseFormField v-model="activeUser.username" type="text" name="username" label="Username" :rules="`required|unique:users,username,${user.username}`" placeholder="Username" class="text-lead text-bold" />
            <BaseFormField v-model="activeUser.email" name="email" label="Email" :rules="`required|email|unique:users,email,${user.email}`" autocomplete="off" class="text-lead text-bold" />
            <BaseFormField v-model="activeUser.password" name="password" label="Password" rules="min:8" class="text-lead text-bold" type="password" />
            <BaseFormField v-model="activeUser.name" type="text" name="name" label="Name" rules="required" placeholder="Full Name" class="text-lead" />
            <BaseFormField v-model="activeUser.bio" name="bio" label="Bio" as="textarea" placeholder="Write a few words about yourself." />
            <div class="stats">
                <span>{{ user.postsCount }} posts</span>
                <span>{{ user.threadsCount }} threads</span>
            </div>

            <hr>
            <BaseFormField v-model="activeUser.website" name="website" label="Website" rules="url" autocomplete="off"/>
            <BaseFormField v-model="activeUser.location" name="location" label="Location" list="locations" @mouseenter="loadLocationOptions" />
            <datalist id="locations">
              <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common" />
            </datalist>
            <div class="btn-group space-between">
                <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
                <button type="submit" class="btn-blue">Save</button>
            </div>
          </VeeForm>
          <UserProfileCardEditorReauthenticate
            v-model="needsReAuth"
            @success="onReauthenticated"
            @fail="onReauthenticatedFail"
          />
        </div>
</template>

<script>
import { mapActions } from 'vuex'
import UserProfileCardEditorRandomAvatar from './UserProfileCardEditorRandomAvatar'
import UserProfileCardEditorReauthenticate from './UserProfileCardEditorReauthenticate'
import useNotifications from '@/composables/useNotifications'
export default {
  components: { UserProfileCardEditorRandomAvatar, UserProfileCardEditorReauthenticate },
  setup () {
    const { addNotification } = useNotifications()
    return { addNotification }
  },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user },
      locationOptions: [],
      needsReAuth: false,
      emailChanged: false,
      passwordChanged: false
    }
  },
  props: {
    user: {
      required: true,
      type: Object
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async loadLocationOptions () {
      if (this.locationOptions.length) return
      const res = await fetch('https://restcountries.com/v3/all')
      this.locationOptions = await res.json()
    },
    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    async handleRandomAvatarUpload () {
      const randomAvatarGenerated = this.activeUser.avatar.startsWith('https://pixabay')
      if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar)
        const blob = await image.blob()
        this.activeUser.avatar = await this.uploadAvatar({ file: blob, filename: 'random' })
      }
    },
    async saveUserData () {
      await this.$store.dispatch('users/updateUser', { ...this.activeUser, threads: this.activeUser.threadIds })
      this.$router.push({ name: 'AuthUserProfile' })
    },
    async onReauthenticated () {
      if (this.emailChanged) await this.$store.dispatch('auth/updateEmail', { email: this.activeUser.email })
      if (this.passwordChanged) await this.$store.dispatch('auth/updatePassword', { password: this.activeUser.password })
      this.saveUserData()
      this.addNotification({ message: 'User successfully updated', timeout: 3000 })
    },
    async onReauthenticatedFail () {
      this.addNotification({ message: 'Error updating user', type: 'error', timeout: 3000 })
      this.$router.push({ name: 'Profile ' })
    },
    async save () {
      await this.handleRandomAvatarUpload()
      const emailChanged = this.activeUser.email !== this.user.email
      // change data for use with onReauthenticated
      if (emailChanged) this.emailChanged = true
      const passwordChanged = this.activeUser.password !== this.user.password
      if (passwordChanged) this.passwordChanged = true
      if (emailChanged || passwordChanged) {
        this.needsReAuth = true
      } else {
        this.saveUserData()
      }
    },
    cancel () {
      this.$router.push({ name: 'AuthUserProfile' })
    }
  }
}
</script>

<style scoped>
.avatar-edit {
  position: relative;
}
.avatar-edit .avatar-upload-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
