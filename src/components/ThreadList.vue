\<template>
<div class="col-full">

          <div class="thread-list">

              <h2 class="list-title">Threads</h2>
              <div v-if="threads.length">
                <ThreadListItem v-for="thread in threads" :thread="thread" :key="thread.id" />
              </div>
              <div v-if="!threads.length" style="padding: 10px; text-align: center;">
                <em>No threads available.</em>
              </div>
          </div>

      </div>
</template>

<script>
import ThreadListItem from '@/components/ThreadListItem'
export default {
  components: {
    ThreadListItem
  },
  props: {
    threads: {
      type: Object,
      required: true
    }
  }
}

</script>

<style scoped>

</style>
