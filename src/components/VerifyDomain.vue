<template>
  <div class="verify-domain">
    <p>Please ensure you are visiting {{url}}</p>
    <div class="box">
      <i class="fa fa-lock"></i> | <span>https:</span>//{{urlShort}}
    </div>
  </div>
</template>

<script>
import tools from '../mixins/tools'
import { mapGetters } from 'vuex'

export default {
  name: 'VerifyDomain',
  computed: {
    url() {
      return tools.lang.url
    },
    urlShort() {
      return tools.lang.urlShort
    }
  }
}
</script>