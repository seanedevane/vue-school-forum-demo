<template>
<div class="container" style="width: 100%;">
    <div class="flex-grid">
        <div class="col-3 push-top">
          <UserProfileCard :user="user" />

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
import { getValue } from '@/helpers'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'

export default {
  components: {
    PostList,
    UserProfileCard
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    // TODO: look into using fetchBeforeNavigation to fix this props issue: https://router.vuejs.org/guide/advanced/data-fetching.html#fetching-after-navigation
    // For the '/me' route it doesn't pass in an id prop, so user() here will come back as undefined.
    ...mapGetters('auth', ['authUser']),
    user () {
      return this.$store.getters['users/user'](this.id)
    },
    lastPostFetched () {
      if (this.user.posts.length === 0) return null
      return this.user.posts[this.user.posts.length - 1]
    }
  },
  methods: {
    fetchUserPosts () {
      return this.$store.dispatch('users/fetchUsersPosts', { id: this.id, startAfter: this.lastPostFetched })
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
