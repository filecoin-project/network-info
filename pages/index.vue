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
                @filterBarFocused="updateRoute('filter-bar-focused')" />

              <button
                class="expand-toggle-button"
                @click="updateRoute('expand-toggle', false)">
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
              @updateRoute="updateRoute" />

          </div>
        </div>
      </div>
    </section>

    <section v-else>
      <div class="grid-center">
        <div class="col-6_md-8_sm-12">
          <div class="placeholder">
            No network information is currently available, check back again soon.
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import Api from '@/api'

import FilterBar from '@/components/Shared/FilterBar'
import AccordionTab from '@/components/Shared/AccordionTab'

import ContentData from '@/static/content.json'

/*
  - If no JSON files found in @/networks, return false
  - Otherwise, return an array of paths, ex: ['./network1.json', './network2.json']
*/
const importAll = (req, next) => {
  const files = req.keys()

  files.sort(function (a, b) {
    if (a === b) {
      return 0
    }

    if (a === './mainnet.json' || (a === './testnet.json' && b !== './mainnet.json')) {
      return -1
    }

    if (b === './mainnet.json' || b === './testnet.json') {
      return 1
    }
    return a.localeCompare(b)
  })
  if (files.length > 0) { return next(files) }
  return next(false)
}

/*
  Grab the Network Schema (xhr) and ContentData (local)
*/
const getBaseData = async (store) => {
  const networkSchema = await Api.getData('http://127.0.0.1:5000/schemas/network.json')
  await store.dispatch('global/setNetworkSchema', networkSchema)
  await store.dispatch('global/setContentData', ContentData) // <-- This content (eg: navigation links) is still being loaded statically! (line 50 above)
}

/*
  Grab the network data (xhr)
*/
const getData = async (store, networks) => {
  const len = networks.length
  for (let i = 0; i < len; i++) {
    const network = networks[i]
    const filename = network.split('./')[1]
    const key = filename.split('.')[0]
    const data = await Api.getData(`http://127.0.0.1:5000/networks/${filename}`)
    if (!data.hasOwnProperty('error')) {
      await store.dispatch('global/setNetworkData', { key, data })
    }
  }
}

/*
  If URL contains network tag as a hash (ex: /#network) and the network is live,
  move the relevant network to the top of the list andtoggle the network open on
  component mount
*/
const toggleAccordionIfRouteMatches = (action, instance) => {
  const tag = instance.$route.hash.split('#')[1]
  const networks = instance.networks
  if (networks) {
    const index = networks.findIndex(network => network.key === tag)
    if (index !== -1) {
      instance.moveNetworkToIndex({
        fromIndex: index,
        toIndex: 0
      })
      instance.toggleAccordion(tag)
      instance.expandToggleText = 'Collapse All'
    } else {
      if (instance.routeAction !== 'filter-bar-focused') {
        instance.expandToggle('close-all')
      }
    }
  }
}

// ====================================================================== Export
export default {
  name: 'Index',

  components: {
    FilterBar,
    AccordionTab
  },

  async fetch ({ store, req }) {
    await getBaseData(store)
    await importAll(require.context('../static/networks/', true, /\.json$/), async (networks) => {
      if (networks) {
        await getData(store, networks) // You can find this function up above the export statement
      }
    })
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
    '$route' (val) {
      toggleAccordionIfRouteMatches('detect-route-change', this)
    }
  },

  mounted () {
    this.$nextTick(() => {
      toggleAccordionIfRouteMatches('mounted', this)
    })
  },

  methods: {
    ...mapActions({
      moveNetworkToIndex: 'global/moveNetworkToIndex'
    }),
    setFilterValue (value) {
      this.filterValue = value
    },
    updateRoute (action, tag) {
      this.routeAction = action
      this.$router.push({ path: '/', ...tag && { hash: `#${tag}` } })
      if (action === 'expand-toggle') {
        this.expandToggle()
      } else if (action === 'filter-bar-focused') {
        this.expandToggle('filter-bar-focused')
      } else if (tag === this.active) {
        this.$router.push({ path: '/', hash: false })
      }
    },
    toggleAccordion (tag) {
      this.forceActive = false
      this.expandToggleText = 'Collapse All'
      const timeout = setTimeout(() => {
        this.active = tag
        clearTimeout(timeout)
      }, 10)
    },
    expandToggle (action) {
      const toggle = this.forceActive
      this.active = ''
      if (action === 'open-all' || action === 'filter-bar-focused' || (action !== 'close-all' && !toggle)) {
        this.expandToggleText = 'Collapse All'
        this.forceActive = true
      } else {
        this.expandToggleText = 'Expand All'
        this.forceActive = false
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

.placeholder {
  @include shadow6;
  padding: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  margin-top: 5rem;
}

// ///////////////////////////////////////////////////////////////////// Toolbar
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
}

// //////////////////////////////////////////////////////// Expand Toggle Button
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

// /////////////////////////////////////////////////////////////////// Accordion
.accordion {
  margin-top: 3rem;
  padding-bottom: 1rem;
}
</style>
