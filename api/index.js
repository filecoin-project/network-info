import Axios from 'axios'

export default {
  // ////////////////////////////////////////////////////////////////// Get Data
  // ---------------------------------------------------------------------------
  getData (url) {
    return Axios
      .get(url)
      .then((response) => {
        return response.data
      }).catch((error) => {
        return { error }
      })
  }
}
