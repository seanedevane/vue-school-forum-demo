<template>
<div class="container" style="width: 100%;">
    <div class="flex-grid">
        <div class="col-3 push-top">
          <UserProfileCard v-if="!edit" :user="user" />
          <UserProfileCardEditor v-else :user="user" />
          <p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>
          <div class="text-center">
            <hr>
            <router-link v-show="!edit" :to="{name: 'ProfileEdit'}" class="btn-green btn-small">Edit Profile</router-link>
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
            <BaseInfiniteScroll
              @load="fetchUserPosts"
              :done="user.posts.length === user.postsCount"
            />
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import PostList from '@/components/PostList'
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
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters('auth', { user: 'authUser' }),
    lastPostFetched () {
      if (this.user.posts.length === 0) return null
      return this.user.posts[this.user.posts.length - 1]
    }
  },
  methods: {
    fetchUserPosts () {
      return this.$store.dispatch('auth/fetchAuthUsersPosts', { startAfter: this.lastPostFetched })
    }
  },
  async created () {
    await this.fetchUserPosts()
    this.asyncDataStatus_fetched()
  }

}
</script>

<style scoped>
</style>
