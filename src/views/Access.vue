<template>
  <div class="main-content" key="access">
    <Start v-if="!loaded" @load="loaded=true" />
    <Accessing v-if="loaded" @unload="loaded=false" />
  </div>
</template>

<script>
import Start from '../components/Access/Start'
import Accessing from '../components/Access/Accessing'

export default {
  name: "Access",
  title: "Access Wallet",
  pageClass: "access",
  components: { Start, Accessing },
  data() {
    return {
      loaded: false
    }
  }
};
</script>