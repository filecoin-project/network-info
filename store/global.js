// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
export const state = () => ({
  networkSchema: false,
  calibrationData: false,
  contentData: false
})

export const getters = {
  networkSchema: state => state.networkSchema,
  calibrationData: state => state.calibrationData,
  contentData: state => state.contentData,
  navigationLinks: state => state.contentData.navigation.links
}

export const actions = {
  setNetworkSchema ({ commit }, schema) {
    commit('SET_NETWORK_SCHEMA', schema)
  },
  setCalibrationData ({ commit }, data) {
    commit('SET_CALIBRATION_DATA', data)
  },
  setContentData ({ commit }, data) {
    commit('SET_CONTENT_DATA', data)
  }
}

export const mutations = {
  SET_CONTENT_DATA (state, data) {
    state.contentData = data
  },
  SET_NETWORK_SCHEMA (state, schema) {
    state.networkSchema = schema
  },
  SET_CALIBRATION_DATA (state, data) {
    state.calibrationData = data
  }
}
