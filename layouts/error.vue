<template>
  <div class="master-container error-page">

    <div class="grid">
      <div class="col">

        <div class="error-number">
          {{ code }}
        </div>

        <h1 class="heading">
          {{ message }}
        </h1>

      </div>
    </div>

  </div>
</template>

<script>
// =================================================================== Functions
export default {
  name: 'ErrorPage',

  props: {
    error: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      code: '',
      message: ''
    }
  },

  mounted () {
    const code = this.error.statusCode
    this.code = code
    if (code === 404) {
      this.message = 'Could not find what you\'re looking for'
    } else {
      this.message = 'Oops, something went wrong'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
[class~="grid"],
[class*="grid-"],
[class*="grid_"] {
  position: relative;
  z-index: 10;
}

// ///////////////////////////////////////////////////////////////////// Content
.error-number,
.heading {
  text-align: center;
}

.error-number {
  font-size: 1.2rem;
  color: #707070;
  margin-top: 5rem;
}

.heading {
  margin-bottom: 2rem;
  font-size: 3rem;
}
</style>
