<template>
  <div id="app">
    <div class="app-main page" :class="[pageClass]">
      <div class="main">
        <Header />
        <transition name="animation-fade-fast" mode="out-in">
          <router-view />
        </transition>
      </div>

      <Footer />
    </div>

    <Popups />
  </div>
</template>

<script>
import Header from "./components/Header"
import Footer from "./components/Footer"
import Popups from './views/Popups'

import tools from "./mixins/tools";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: { Header, Footer, Popups },
  computed: {
    ...mapGetters(["pageClass"]),
    includeHeader() {
      return this.pageClass !== "no-header";
    }
  },
  beforeCreate() {
    if (process.env.NODE_ENV === 'development') tools.setTheme('dark')

    switch (tools.getTheme()) {
      case 'light':
        if (process.env.NODE_ENV === 'development') require('./assets/sass/main.scss')
        else document.getElementById('dark-theme').remove()

        break
      case 'dark':
        if (process.env.NODE_ENV === 'development') require('./assets/sass/themes/dark/main.scss')
        else document.getElementById('light-theme').remove()

        break
    }  

    if (process.env.NODE_ENV === 'development') {
      document.getElementById('dark-theme').remove()
      document.getElementById('light-theme').remove()
    }
  }
};
</script>