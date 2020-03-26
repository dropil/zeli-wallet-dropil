<template>
  <div class="proposal" ref="proposal">
    <div class="top">
      <div class="status">
        <div class="tag" :class="status(p.status).toLowerCase().replace(/ /g, '-')">{{status(p.status)}}</div>
      </div>
      <div class="title">{{p.title}}</div>      
    </div>
    <div class="body">
      <div class="description" :class="{overlap: detailsShowing || detailsHiding, hidden: detailsShown}" v-html="formatShortDescription(p.description)"></div>          

      <transition name="animation-slide" mode="out-in" 
        @before-enter="detailsShowing = true" 
        @after-enter="detailsShown = true; detailsShowing = false" 
        @before-leave="detailsShown = false; detailsHiding = true" 
        @after-leave="detailsHiding = false"
      >
        <div class="wrapper" v-show="showDetails">
          <div class="description pre" v-html="formatDescription(p.description)"></div>

          <div class="split"></div>

          <div class="details">
            <div class="dates">
              <div class="date">
                <div class="key">Submit Date: </div>
                <div class="value">{{formatDate(p.data.submit_time)}}</div>
              </div>

              <div class="date">
                <div class="key">Deposit End Date: </div>
                <div class="value">{{formatDate(p.data.deposit_end_time)}}</div>
              </div>

              <div class="date">
                <div class="key">Voting Start Date: </div>
                <div class="value">{{formatDate(p.data.voting_start_time)}}</div>
              </div>

              <div class="date">
                <div class="key">Voting End Date: </div>
                <div class="value">{{formatDate(p.data.voting_end_time)}}</div>
              </div>

              <div class="date">
                <div class="key">Total Deposit: </div>
                <div class="value">{{formatAmount(p.data.total_deposit.filter(x => x.denom === meta.denom)[0].amount)}} {{meta.tickerPlural}}</div>
              </div>
            </div>

            <div class="voting">
              <div class="vote">
                <div class="key">Voted Yes: </div>
                <div class="value">{{formatAmount(tallyYes)}} {{meta.tickerPlural}} - <b>{{formatPercent(tallyYes)}}%</b></div>
              </div>
              <div class="vote">
                <div class="key">Voted No: </div>
                <div class="value">{{formatAmount(tallyNo)}} {{meta.tickerPlural}} - <b>{{formatPercent(tallyNo)}}%</b></div>
              </div>
              <div class="vote">
                <div class="key">Voted Veto: </div>
                <div class="value">{{formatAmount(tallyNoWithVeto)}} {{meta.tickerPlural}} - <b>{{formatPercent(tallyNoWithVeto)}}%</b></div>
              </div>
              <div class="vote">
                <div class="key">Abstained: </div>
                <div class="value">{{formatAmount(tallyAbstain)}} {{meta.tickerPlural}} - <b>{{formatPercent(tallyAbstain)}}%</b></div>
              </div>
            </div>
          </div>
        </div>        
      </transition>           

      <div class="actions">
        <div class="date">
          <span v-show="!detailsShowing && !detailsHiding && !detailsShown">Submit Date: {{formatDate(p.submitDate)}}</span>
        </div>

        <div class="buttons">
          <a class="btn" @click="toggleDetails()">{{showDetails ? "Hide" : "Show"}} Details</a>
          <a v-if="p.allowVote" class="btn b" @click="vote(p.id)">Vote</a>
          <a v-else class="btn disabled" v-tooltip="'The voting period on this proposal has passed'">Vote</a>
        </div>              
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import tools from '../../../../mixins/tools'
import { mapGetters } from 'vuex'
import store from '../../../../store'
import { SET_VOTE_PROPOSAL } from '../../../../store/actions.type'

const ZERO_TALLY = {
  yes: "0",
  abstain: "0",
  no: "0",
  no_with_veto: "0"
}

export default {
  name: 'Proposal',
  props: {
    p: Object
  },
  data() {
    return {      
      showDetails: false,
      detailsShowing: false,
      detailsShown: false,
      detailsHiding: false,      
      currentTally: { ...ZERO_TALLY }
    }
  },
  computed: {
    ...mapGetters(['meta']),
    totalVote() {
      return parseInt(this.tallyYes)
        + parseInt(this.tallyNo)
        + parseInt(this.tallyNoWithVeto)
        + parseInt(this.tallyAbstain)
    },
    tallyYes() {
      return String(parseInt(this.p.data.final_tally_result.yes) || this.currentTally.yes)
    },
    tallyNo() {
      return String(parseInt(this.p.data.final_tally_result.no) || this.currentTally.no)
    },
    tallyNoWithVeto() {
      return String(parseInt(this.p.data.final_tally_result.no_with_veto) || this.currentTally.no_with_veto)
    },
    tallyAbstain() {
      return String(parseInt(this.p.data.final_tally_result.abstain) || this.currentTally.abstain)
    },
    currentTallyLoaded() {
      return JSON.stringify(this.currentTally) !== JSON.stringify({ ...ZERO_TALLY })
    }
  },
  mounted() {
    this.$root.$on('getProposals', () => this.getCurrentTally())
  },
  destroyed() {
    this.$root.$off('getProposals')
  },
  methods: {
    status(s) {
      if (['passed', 'rejected'].includes(s.toLowerCase())) return s
      if (s.toLowerCase() === 'votingperiod') return 'Voting Open'
    },
    formatShortDescription(descr) {
      descr = descr.replace(/\\n/g, '<br>')
      if (!descr.length || descr.length < 200) return descr
      return descr.substr(0, 200) + (this.showDetails ? '' : '...')
    },
    formatDescription(descr) {      
      return descr.replace(/\\n/g, '<br>')      
    },
    formatDate(date) {      
      return moment(date).format("MMM Do, YYYY [at] h:mm a")
    },
    formatAmount(amount) {
      return tools.toCoinAmount(amount) 
    },
    formatPercent(amount) {
      if (String(amount) === "0") return "0"
      return Math.round(parseInt(amount) / this.totalVote * 100 * 100) / 100
    },
    toggleDetails() {
      this.showDetails = !this.showDetails      

      let rect = this.$refs.proposal.getBoundingClientRect()
      if (!this.showDetails && rect.top < 0) this.$refs.proposal.scrollIntoView({ behavior: "smooth", block: "start" })

      if (!this.currentTallyLoaded) this.getCurrentTally()      

      if (!this.showDetails) this.detailsHiding = true
    },
    async getCurrentTally() {
      if (!this.showDetails) return
      this.currentTally = await tools.fetch(this.meta.apiUrl + `/gov/proposals/${this.p.id}/tally`).then(data => data.result)
    },
    vote(proposalId) {
      if (!this.p.allowVote) return
      store.dispatch(SET_VOTE_PROPOSAL, this.p)
      this.$popup('vote')
    }
  }
}
</script>