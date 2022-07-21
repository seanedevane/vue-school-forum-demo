<template>
  <the-navbar/>
  <div class="container">
    <router-view v-show="showPage" @ready="onPageReady"/>
    <BaseSpinner class="push-top" v-show="!showPage" />
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar'
import { mapActions } from 'vuex'
import NProgress from 'nprogress'
export default {
  name: 'App',
  components: {
    TheNavbar
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
    onPageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  data () {
    return {
      showPage: false
    }
  },
  created () {
    this.fetchAuthUser()
    this.$router.beforeEach(() => {
      NProgress.configure({
        speed: 200,
        showSpinner: false
      })
      this.showPage = false
      NProgress.start()
    })
  }
}
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  }

#nprogress .bar {
  background: #57AD8D !important
}
</style>
