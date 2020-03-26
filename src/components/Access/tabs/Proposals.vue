<template>
  <div class="tab-content proposals">
    <div class="section">
      <div class="top">
        <h3>Proposals on {{meta.chainAndEnvironment}}</h3>
        <a class="btn create" @click="$popup('new-proposal')">New Proposal</a>

        <p>
          View all governance proposals on {{meta.chainAndEnvironment}} and vote on pending proposals.
        </p>
      </div>      

      <div class="loading-proposals" v-show="!proposals.length">
        <Loading />
      </div>

      <div class="proposals" v-show="proposals.length">
        <Proposal :p="proposal" v-for="proposal in proposals" :key="proposal.id" />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '../../MiniComponents/Loading'
import Proposal from './components/Proposal'
import { mapGetters } from 'vuex'

export default {
  name: 'Proposals',
  components: { Loading, Proposal },
  computed: {
    ...mapGetters(['meta'])
  },
  data() {
    return {
      proposals: []
    }
  },
  mounted() {
    this.getProposals()
    this.$root.$on('getProposals', () => this.getProposals())
  },
  destroyed() {
    this.$root.$off('getProposals')
  },
  methods: {
    async fetch(url) {
      let response = await fetch(url);
      let data = await response.json();
      return data;
    },
    async getProposals() {
      this.proposals = await this.fetch(this.meta.apiUrl + '/gov/proposals').then(data => {
        let props = data.result.map(p => {
          return {
            id: p.id,
            title: p.content.value.title,
            description: p.content.value.description,
            status: p.proposal_status,
            submitDate: new Date(p.submit_time),
            allowVote: !['passed', 'rejected'].includes(p.proposal_status.toLowerCase()),
            data: p
          }
        })

        props.sort((a, b) => b.id - a.id)

        return props
      })
    }
  }
}
</script>