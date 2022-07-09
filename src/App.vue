<template>
  <the-navbar/>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    TheNavbar
  },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
  }
}
</script>

<style>
@import "assets/style.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
