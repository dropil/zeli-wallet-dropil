<template>
  <div class="main-content" key="faucet">
    <div class="content">
      <h3>{{meta.chainAndEnvironment}} Faucet</h3>
      <VerifyDomain />

      <LoginForm :description="loginFormDescription" v-if="!isAuth" />
      <Active v-if="isAuth" />
    </div>    
  </div>
</template>

<script>
import VerifyDomain from '../components/VerifyDomain'
import LoginForm from '../components/LoginForm'
import Active from '../components/Faucet/Active'
import { mapGetters } from 'vuex'

export default {
  name: 'Faucet',
  pageClass: 'faucet',
  title: 'Faucet',
  components: { VerifyDomain, LoginForm, Active },
  computed: {
    ...mapGetters(['meta', 'isAuth']),
    loginFormDescription() {
      return `In order to use the testnet faucet, you must login to your Dropil account.
              We require login to prevent abuse of the faucet.`
    }
  }  
}
</script>