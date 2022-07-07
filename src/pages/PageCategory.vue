<template>
  <h1>{{ category.name }}</h1>
  <ForumList
    :title="category.name"
    :forums="getForumsForCategory(category)"

  />
</template>

<script>
import { findById } from '@/helpers'
import ForumList from '@/components/ForumList'
import { mapActions } from 'vuex'
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
  computed: {
    category () {
      return findById(this.$store.state.categories, this.id) || {}
    }
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    },
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    this.fetchForums({ ids: category.forums })
  }
}
</script>
<style scoped></style>
