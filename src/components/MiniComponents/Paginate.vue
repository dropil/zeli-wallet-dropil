<template>
  <transition name="animation-fade-fast" mode="out-in">
    <div class="pagination-container" v-if="numPages > 1">
      <div class="info">Showing {{itemsPerPage}} of {{numItems}} items</div>
      <div class="pagination">
        <a class="previous" @click="changePage(-1)" :class="{disabled:!prevActive}"></a>
        <a class="first" @click="page(first)" :class="{active:currentPage===first}" v-if="hasFirst">{{first}}</a>
        <a class="more start" @click="changePage(-5)" v-tooltip="'Skip 5'" v-if="hasFirstMore"></a>
        <a class="middle" @click="page(middle1)" :class="{active:currentPage===middle1}" v-if="hasMiddle1">{{middle1}}</a>
        <a class="middle" @click="page(middle2)" :class="{active:currentPage===middle2}" v-if="hasMiddle2">{{middle2}}</a>
        <a class="middle" @click="page(middle3)" :class="{active:currentPage===middle3}" v-if="hasMiddle3">{{middle3}}</a>
        <a class="middle" @click="page(middle4)" :class="{active:currentPage===middle4}" v-if="hasMiddle4">{{middle4}}</a>
        <a class="middle" @click="page(middle5)" :class="{active:currentPage===middle5}" v-if="hasMiddle5">{{middle5}}</a>
        <a class="more end" @click="changePage(5)" v-tooltip="'Skip 5'" v-if="hasLastMore"></a>
        <a class="last" @click="page(last)" :class="{active:currentPage===last}" v-if="hasLast">{{last}}</a>
        <a class="next" @click="changePage(1)" :class="{disabled:!nextActive}"></a>
      </div>
    </div>  
  </transition>
</template>

<script>
export default {
  name: 'Paginate',
  props: {
    numItems: Number,
    itemsPerPage: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  computed: {
    numPages () {
      return Math.ceil(parseFloat(this.numItems) / parseFloat(this.itemsPerPage))
    },
    prevActive() {
      return this.currentPage != this.first
    },
    hasFirst () {
      // first page only shows if first more ellipsis are showing
      // otherwise middle1 is used for first page
      return this.hasFirstMore
    },
    first () {
      return 1
    },
    hasFirstMore () {
      // this is only true if there are at least 7 pages
      // and current page is >= 3
      return (this.numPages >= 7 && this.currentPage >= 5) || (this.numPages === 6 && this.currentPage >= 2)
    },
    hasMiddle1 () {
      // this is always true because minimum of 2 pages for pagination
      return true
    },
    middle1 () {
      return this.middle3 - 2
    },
    hasMiddle2 () {
      // this is always true because minimum of 2 pages for pagination
      return true
    },
    middle2 () {
      return this.middle3 - 1
    },
    hasMiddle3 () {
      // this is true as long as there is at least 3 pages
      return this.numPages >= 3
    },
    middle3 () {
      // if first ellipsis do not exist then this is 3      
      if (!this.hasFirstMore) return 3
      // if first ellipsis exist, but last ellipsis do not, then this is last - 2
      else if (!this.hasLastMore) return this.last - 2
      // otherwise this is the current page (both ellipsis exist)
      else return this.currentPage
    },
    hasMiddle4 () {
      // this is true as long as there is at least 4 pages
      return this.numPages >= 4
    },
    middle4 () {
      return this.middle3 + 1
    },
    hasMiddle5 () {
      // this is true as long as there is at least 5 pages
      return this.numPages >= 5
    },
    middle5 () {
      if (!this.hasLastMore) return this.last
      return this.middle3 + 2
    },
    hasLastMore () {
      // this is only true if there are at least 9 pages
      // and the current page is at least 5 less than the last page
      return this.numPages >= 6 && this.currentPage <= this.numPages - 5
    },    
    hasLast () {
      // last page only shows if the last more ellipsis are showing
      // otherwise middle5 is used for last page
      return this.hasLastMore
    },
    last () {
      return this.numPages
    },
    nextActive () {
      return this.currentPage != this.numPages
    }
  },
  methods: {
    changePage (num) {
      if (this.currentPage + num < 1) {
        this.updateCurrentPage(1)
        return
      }
      else if (this.currentPage + num > this.numPages) {
        this.updateCurrentPage(this.numPages)
        return
      }
      
      this.updateCurrentPage(this.currentPage + num)
    },
    page (num) {
      this.updateCurrentPage(num)
    },
    updateCurrentPage (num) {
      this.currentPage = num
      this.$root.$emit('tablePageUpdate', num)
      this.$emit('tablePageUpdate', num)
    }
  }
}
</script>