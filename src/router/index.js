import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/create',
      name: 'create',
      component: view('Create')
    },
    {
      path: '/access',
      name: 'access',
      component: view('Access')
    },
    {
      path: '/faucet',
      name: 'faucet',
      component: view('Faucet')
    },
    {
      path: '/:chainId?/:environment?',
      name: 'home',
      component: view('Home')
    }    
  ]
})

function view(name) {
  return function(resolve) {
      require(['../views/' + name + '.vue'], resolve);
  }
}