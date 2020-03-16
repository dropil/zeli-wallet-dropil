<template>
  <div id="app">
    <div class="app-main page" :class="[pageClass]">
      <div class="main">
        <Header />
        <transition name="animation-fade" mode="out-in">
          <router-view />
        </transition>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

import tools from "./mixins/tools";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: { Header, Footer },
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