<template>
  <div class="container" role="main">

    <section v-if="networks && networkSchema" class="accordion">
      <div class="grid-center">
        <div class="col-8_md-10_sm-12">
          <div class="inner-content">

            <div class="toolbar">

              <FilterBar
                :filter-value="filterValue"
                @setFilterValue="setFilterValue"
                @filterBarFocused="filterBarFocused" />

              <button
                class="expand-toggle-button"
                @click="expandToggle">
                {{ expandToggleText }}
              </button>

            </div>

            <AccordionTab
              v-for="network in networks"
              :key="network.key"
              :data="network.data"
              :active="active"
              :force-active="forceActive"
              :filter-value="filterValue"
              :tag="network.key"
              @toggleAccordion="toggleAccordion" />

          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import Api from '@/api'

import FilterBar from '@/components/Shared/FilterBar'
import AccordionTab from '@/components/Shared/AccordionTab'

import NetworkList from '@/static/network-list.json'
import ContentData from '@/static/content.json'

const getData = async (store) => {
  const networkSchema = await Api.getData('https://raw.githubusercontent.com/filecoin-project/network-info/master/schemas/network.json')
  const networks = NetworkList.networks
  const len = networks.length
  for (let i = 0; i < len; i++) {
    const network = networks[i]
    const key = network.name
    const data = await Api.getData(`https://raw.githubusercontent.com/filecoin-project/network-info/master/networks/${key}.json`)
    await store.dispatch('global/setNetworkData', { key, data })
  }
  await store.dispatch('global/setNetworkSchema', networkSchema)
  await store.dispatch('global/setContentData', ContentData) // <-- This content (eg: navigation links) is still being loaded statically! (line 50 above)
}

// ====================================================================== Export
export default {
  name: 'Index',

  components: {
    FilterBar,
    AccordionTab
  },

  async fetch ({ store }) {
    await getData(store) // You can find this function up above the export statement
  },

  data () {
    return {
      active: '',
      forceActive: false,
      expandToggleText: 'Expand All',
      filterValue: ''
    }
  },

  computed: {
    ...mapGetters({
      contentData: 'global/contentData',
      networkSchema: 'global/networkSchema',
      networkData: 'global/networkData'
    }),
    seo () {
      return this.contentData.seo
    },
    seoTitle () {
      return this.seo.title
    },
    seoDescription () {
      return this.seo.description
    },
    og () {
      return this.contentData.og
    },
    ogTitle () {
      return this.og.title
    },
    ogSiteName () {
      return this.og.site_name
    },
    ogUrl () {
      return this.og.url
    },
    ogType () {
      return this.og.type
    },
    ogDescription () {
      return this.og.description
    },
    ogImage () {
      return this.og.image
    },
    networks () {
      const networks = this.networkData
      if (networks.length > 0) { return networks }
      return false
    }
  },

  watch: {
    active (val) {
      if (val !== '') {
        this.expandToggleText = 'Collapse All'
      } else {
        this.expandToggleText = 'Expand All'
        this.forceActive = false
      }
    }
  },

  async mounted () {
    const now = new Date()
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    console.log(`${date} at ${time}`)
    await getData(this.$store) // You can find this function up above the export statement
  },

  methods: {
    setFilterValue (value) {
      this.filterValue = value
    },
    filterBarFocused () {
      this.expandToggleText = 'Collapse All'
      this.forceActive = true
    },
    toggleAccordion (tag) {
      if (this.forceActive) {
        this.forceActive = false
      } else if (this.active === '') {
        this.active = tag
      } else if (this.active === tag) {
        this.active = ''
      } else {
        this.active = tag
      }
    },
    expandToggle () {
      const toggle = this.forceActive
      if (toggle) {
        this.expandToggleText = 'Expand All'
        this.forceActive = false
        this.active = ''
      } else if (this.active !== '') {
        this.expandToggleText = 'Expand All'
        this.active = ''
      } else {
        this.expandToggleText = 'Collapse All'
        this.forceActive = true
      }
    }
  },

  head () {
    return {
      title: this.seoTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.seoDescription
        },
        { hid: 'og:title', property: 'og:title', content: this.ogTitle },
        { hid: 'og:site_name', property: 'og:site_name', content: this.ogSiteName },
        { hid: 'og:url', property: 'og:url', content: this.ogUrl },
        { hid: 'og:type', property: 'og:type', content: this.ogType },
        { hid: 'og:description', property: 'og:description', content: this.ogDescription },
        { hid: 'og:image', property: 'og:image', content: this.ogImage },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:image', name: 'twitter:image', content: this.ogImage }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.container {
  position: relative;
  z-index: 10;
  transition: 400ms ease-in-out;
}

.inner-content {
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
}

.expand-toggle-button {
  text-transform: lowercase;
  font-weight: 400;
  font-size: 0.75rem;
  color: $gray800;
  white-space: nowrap;
  transition: 150ms linear;
  &:hover {
    transition: 150ms linear;
    color: $dodgerBlue;
  }
}

.accordion {
  margin-top: 3rem;
  padding-bottom: 1rem;
}
</style>
