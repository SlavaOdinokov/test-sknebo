export default {
  GET_NEW_COORDS({commit}, newCoords) {
    commit('CHANGE_COORDS', newCoords)
  }
}
