<template>
  <div class="container" v-if="asyncDataStatus_ready">
    <h1>{{ category.name }}</h1>
    <ForumList
      :title="category.name"
      :forums="getForumsForCategory(category)"

    />
  </div>
</template>

<script>
import { findById } from '@/helpers'
import ForumList from '@/components/ForumList'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  components: {
    ForumList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    category () {
      return findById(this.$store.state.categories.items, this.id) || {}
    }
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.items.filter(forum => forum.categoryId === category.id)
    },
    ...mapActions('categories', ['fetchCategory']),
    ...mapActions('forums', ['fetchForums'])

  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
    this.asyncDataStatus_fetched()
  }
}
</script>
<style scoped></style>
