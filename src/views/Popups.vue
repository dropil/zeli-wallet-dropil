<template>
  <transition name="animation-fade">
    <div
      v-if="showPopup"
      class="popups close"
      :class="{'modal-backdrop':!preventShowPopup}"
      @click="closePopup"
      @keydown.esc="closePopup"
      @close-popup="childClosePopup"
    >
      <HdPath v-if="showPopup === 'hd-path'" />      
      <NewProposal v-if="showPopup === 'new-proposal'" />      
      <Vote v-if="showPopup === 'vote'" />      
    </div>
  </transition>
</template>

<script>
import store from '../store'
import { mapGetters } from 'vuex'
import { SET_PREVENT_SHOW_POPUP, CLOSE_POPUP } from '../store/actions.type'

import HdPath from '../components/Popups/HdPath'
import NewProposal from '../components/Popups/NewProposal'
import Vote from '../components/Popups/Vote'

export default {
  name: 'Popups',
  components: {
    HdPath, NewProposal, Vote
  },
  computed: {
    ...mapGetters(['showPopup', 'preventShowPopup'])
  },
  methods: {
    closePopup (e) {
      if (e.target.className.includes('close')) { store.dispatch(CLOSE_POPUP) }
    },
    childClosePopup () {
      store.dispatch(CLOSE_POPUP)
    }
  },
  watch: {
    showPopup (val) {
      if (val) window.addEventListener('keyup', escClosePopup)
    }
  },  
}

function escClosePopup (event) {
  if (event.keyCode === 27) {
    store.dispatch(CLOSE_POPUP)
    window.removeEventListener('keyup', escClosePopup)
  }
}
</script>
