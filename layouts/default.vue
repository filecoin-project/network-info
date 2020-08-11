<template>
  <div class="master-container">

    <SiteHeader />

    <nuxt />

  </div>
</template>

<script>
// ===================================================================== Imports
import SiteHeader from '@/components/Shared/SiteHeader'

// ====================================================================== Export
export default {
  components: {
    SiteHeader
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
