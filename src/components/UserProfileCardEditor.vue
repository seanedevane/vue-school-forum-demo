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
        </div>
</template>

<script>
import { mapActions } from 'vuex'
import UserProfileCardEditorRandomAvatar from './UserProfileCardEditorRandomAvatar'
export default {
  components: { UserProfileCardEditorRandomAvatar },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user },
      locationOptions: []
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
    async save () {
      await this.handleRandomAvatarUpload()
      this.$store.dispatch('users/updateUser', { ...this.activeUser, threads: this.activeUser.threadIds })
      this.$router.push({ name: 'Profile' })
    },
    cancel () {
      this.$router.push({ name: 'Profile' })
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
