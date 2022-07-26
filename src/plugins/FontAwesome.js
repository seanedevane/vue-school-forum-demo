import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencilAlt, faCamera } from '@fortawesome/free-solid-svg-icons'

// Add icons to FA library
library.add(faPencilAlt, faCamera)

export default (app) => {
  app.component('fa', FontAwesomeIcon)
}
