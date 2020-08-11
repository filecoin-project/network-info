export default {
  target: 'static',
  // //////////////////////////////////////////////////////////////////// Server
  // ---------------------------------------------------------------------------
  server: {
    port: 5000
  },
  // /////////////////////////////////////////////////////// Headers of the Page
  // ---------------------------------------------------------------------------
  head: {
    title: 'A decentralized storage network for humanity\'s most important information | Filecoin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Filecoin is making the web more secure and efficient with a decentralized data storage marketplace, protocol, and cryptocurrency. Launching soon.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }
    ]
  },
  // /////////////////////////////////////////////////////// Headers of the Page
  // ---------------------------------------------------------------------------
  // backendBaseUrl: 'http://',
  // ////////////////////////////////////////// Customize the progress-bar color
  // ---------------------------------------------------------------------------
  loading: {
    color: '#FF3100',
    height: '4px'
  },
  // /////////////////////////////////////////////////////////// Global CSS/SCSS
  // ---------------------------------------------------------------------------
  css: [
    '~/assets/scss/normalize.scss',
    '~/assets/scss/gridlex-2.7.1/gridlex.scss',
    '~/assets/scss/main.scss'
  ],
  styleResources: {
    scss: [
      '~/assets/scss/variables.scss'
    ]
  },
  // /////////////////////////////////// Plugins to load before mounting the App
  // ---------------------------------------------------------------------------
  plugins: [
    '~/api/index',
    '~/plugins/directives',
    '~/plugins/global-methods'
  ],
  // /////////////////////////////////////////////////////// Nuxt.js Dev Modules
  // ---------------------------------------------------------------------------
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  // /////////////////////////////////////////////////////////// Nuxt.js Modules
  // ---------------------------------------------------------------------------
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/style-resources'
  ],
  // /////////////////////////////////////////////////////// Router + Middleware
  // ---------------------------------------------------------------------------
  router: {
    // middleware: ''
  },
  // //////////////////////////////////////////////// Axios module configuration
  // -------------------------------------- See https://axios.nuxtjs.org/options
  axios: {
  },
  // /////////////////////////////////////////////////////// Build configuration
  // ------------------------------------------------ Extend webpack config here
  build: {
    hotMiddleware: {
      client: {
        overlay: false
      }
    },
    extend (config, ctx) {
    }
  }
}
