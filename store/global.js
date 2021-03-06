// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
export const state = () => ({
  contentData: false,
  networkSchema: false,
  networkData: []
})

export const getters = {
  contentData: state => state.contentData,
  navigationLinks: state => state.contentData.navigation.links,
  networkSchema: state => state.networkSchema,
  networkData: state => state.networkData
}

export const actions = {
  setContentData ({ commit }, data) {
    commit('SET_CONTENT_DATA', data)
  },
  setNetworkSchema ({ commit }, schema) {
    commit('SET_NETWORK_SCHEMA', schema)
  },
  setNetworkData ({ commit }, data) {
    const exists = this.getters['global/networkData'].find(obj => obj.key === data.key)
    if (!exists) {
      commit('SET_NETWORK_DATA', data)
    }
  },
  moveNetworkToIndex ({ commit }, payload) {
    commit('MOVE_NETWORK_TO_INDEX', payload)
  }
}

export const mutations = {
  SET_CONTENT_DATA (state, data) {
    state.contentData = data
  },
  SET_NETWORK_SCHEMA (state, schema) {
    state.networkSchema = schema
  },
  SET_NETWORK_DATA (state, data) {
    state.networkData.push(data)
  },
  MOVE_NETWORK_TO_INDEX (state, payload) {
    state.networkData.splice(payload.toIndex, 0, state.networkData.splice(payload.fromIndex, 1)[0])
  }
}
