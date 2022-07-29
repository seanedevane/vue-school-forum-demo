# vueschool-masterclass-forum

This project was built as part of Vue School's [Vue.js 3 Masterclass](https://vueschool.io/courses/the-vuejs-3-master-class). It's not intended for production use.

Baseline implementation while following the course uses the following stack:

* Vue 3
* Vue Router
* Vuex
* Firebase (DB, storage, and auth)
* Webpack

There are a few areas of the app that weren't fully implemented as part of the course, which will be added soon:
1. Password resets
1. User profile lookups (currently only supports looking up the authenticated user).
1. Others as identified

Beyond features, this project will also be used as a testbed for migrating pieces of the tech stack: specifically moving from Vuex to Pinia, Firebase to MongoDB, possibly Vite for tooling, and more extensive use of Typescript (currently only used in props).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
