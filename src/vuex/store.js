import Vue from 'vue'
import Vuex from 'vuex'

import commonActions from './actions/actions'
import apiActions from './actions/api'
import mutations from './mutations/mutations'
import getters from './getters/getters'

const actions = {...commonActions, ...apiActions}

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    coords: [55.751137, 37.616459],
    address: ''
  },
  mutations,
  actions,
  getters
})

export default store
