<template>
  <div class="main-content" key="access">
    <Start v-if="!loaded" @load="load()" />
    <Accessing v-if="loaded" @unload="loaded=false" />
  </div>
</template>

<script>
import Start from '../components/Access/start/Start'
import Accessing from '../components/Access/Accessing'
import tools from '../mixins/tools';

export default {
  name: "Access",
  title: "Access Wallet",
  pageClass: "access",
  components: { Start, Accessing },
  data() {
    return {
      loaded: false
    }
  },
  methods: {
    load() {
      this.loaded = true
      window.scrollTo({top: 0, behavior: 'smooth'})      
    }
  }
};
</script>