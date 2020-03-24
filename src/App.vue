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
  }
};

if (process.env.NODE_ENV === "development") {
  require("./assets/sass/main.scss");
  document.head.removeChild(document.getElementById('main-style'))
}
</script>