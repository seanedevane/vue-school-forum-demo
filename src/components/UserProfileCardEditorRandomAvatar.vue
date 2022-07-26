<template>
  <div class="text-center" style="margin-bottom:15px;">
    <button class="btn-green btn-xsmall" @click.prevent="getRandomImage">
      Random Avatar
    </button>
    <br />
    <small style="opacity: .5;">Powered by <a href="https://pixabay.com">Pixabay</a></small>
  </div>
</template>

<script>
// TODO: implement this processing disabled function, I like the idea, but it looks weird UX wise (see comment): https://vueschool.io/lessons/storing-images-to-firebase-storage-from-a-web-url
import { arrayRandom } from '@/helpers'
export default {
  methods: {
    async getRandomImage () {
      const searchTerms = [
        'cats',
        'kitten',
        'dogs',
        'puppy',
        'mountains',
        'beach',
        'landscape',
        'object',
        'flowers',
        'food',
        'abstract',
        'space',
        'animal',
        'code',
        'red',
        'blue',
        'green'
      ]
      const randomWord = arrayRandom(searchTerms)
      const res = await fetch(`https://pixabay.com/api/?key=28862784-a9e307f3bdfa4a3db4a9507e9&q=${randomWord}`)
      const data = await res.json()
      const randomImage = arrayRandom(data.hits)
      this.$emit('hit', randomImage.webformatURL)
    }
  }
}
</script>

<style>

</style>
