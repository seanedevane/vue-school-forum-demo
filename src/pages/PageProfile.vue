<template>
<div class="container" style="width: 100%;">
    <div class="flex-grid">
        <div class="col-3 push-top">
          <UserProfileCard v-if="!edit" :user="user" />
          <UserProfileCardEditor v-if="isAuthUser && edit" :user="user" />
          <div class="text-center">
            <hr>
            <router-link v-show="!edit && isAuthUser" :to="{name: 'ProfileEdit'}" class="btn-green btn-small">Edit Profile</router-link>
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
    },
    id: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      // the profile view has two route entries: '/me' for the authenticated user and '/user/:id' for other users. Default logic only checks auth user, and we only want to see the edit option for auth users.
      isAuthUser: false
    }
  },
  mixins: [asyncDataStatus],
  computed: {
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
    },
    checkAuthUser () {
      // check if we ID matches authUser, if so, set isAuthUser to true to enable editing
      if (this.authUser.id === this.id) {
        this.isAuthUser = true
        console.log('Auth user set to ' + this.isAuthUser)
      } else {
        // this might be redundant with the default
        this.isAuthUser = false
        console.log('Auth user set to ' + this.isAuthUser)
      }
    }
  },
  async created () {
    // thinking through user flow here
    // two pathways: the /me route and the /user/:id route, the latter receives the id prop which will be used to get the right user info in the user computed function.
    // the challenge here is passing a single variable, user, to the template depending on which route we come in through. But because when it's the /me route we can't use the id, it has a different store call.
    this.checkAuthUser()
    await this.fetchUserPosts()
    this.asyncDataStatus_fetched()
  }

}
</script>

<style scoped>
</style>
