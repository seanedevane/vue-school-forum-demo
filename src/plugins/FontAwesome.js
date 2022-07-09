import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

// Add icons to FA library
library.add(faPencilAlt)

export default (app) => {
  app.component('fa', FontAwesomeIcon)
}
