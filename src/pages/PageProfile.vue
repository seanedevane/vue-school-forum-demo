<template>
<div class="container">
    <div class="flex-grid">
          <div class="col-3 push-top">

              <UserProfileCard v-if="!edit" :user="user" />
              <UserProfileCardEditor v-else :user="user" />
              <p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>
              <div class="text-center">
                <hr>
                <router-link :to="{name: 'ProfileEdit'}" class="btn-green btn-small">Edit Profile</router-link>
              </div>

          </div>

          <div class="col-7 push-top">

              <div class="profile-header">
                  <span class="text-lead">
                      {{ user.username }}'s recent activity
                  </span>
                  <a href="#">See only started threads?</a>
              </div>

              <hr>
              <PostList :posts="user.posts" />
          </div>
      </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import { mapGetters } from 'vuex'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'

export default {
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({ user: 'authUser' })
  }

}
</script>

<style scoped>
</style>
