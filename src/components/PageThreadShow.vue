<template>
  <div class="col-large push-top">
            <h1>{{ thread.title }}</h1>

            <p>
                By <a href="#" class="link-unstyled">Robin</a>, 2 hours ago.
                <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">3 replies by 3 contributors</span>
            </p>

            <div class="post-list">
              <div v-for="thread in threads" :key="thread.id">
                <h2>{{ thread.title }}</h2>
                <div v-for="postId in thread.posts" :key="postId">
                <p>  </p>
                <p> </p>
              </div>
                <div class="post"
                      v-for="postId in thread.posts"
                      :key="postId">

                    <div class="user-info">
                        <a href="#" class="user-name">{{userById(postById(postId).userId).name}}</a>

                        <a href="#">
                            <img class="avatar-large" :src="userById(postById(postId).userId).avatar" alt="">
                        </a>

                        <p class="desktop-only text-small">107 posts</p>

                        <p class="desktop-only text-small">23 threads</p>

                        <span class="online desktop-only">online</span>

                    </div>

                    <div class="post-content">
                        <div>
                          <p>
                            {{postById(postId).text}}
                          </p>
                        </div>
                    </div>
                    <div class="post-date text-faded">
                        {{ postById(postId).publishedAt }}
                    </div>
                  </div>
        </div>
      </div>

  </div>
</template>

<script>
import sourceData from '@/data.json'

export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  computed: {
    thread () {
      return this.threads.find(thread => thread.id === this.id)
    }
  },
  methods: {
    postById (postId) {
      return this.posts.find(p => p.id === postId)
    },
    userById (userId) {
      return this.users.find(u => u.id === userId)
    }
  }
}
</script>

<style scoped>

</style>
