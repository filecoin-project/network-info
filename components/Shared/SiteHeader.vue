<template>
  <header id="site-header">
    <div class="grid-center">
      <div class="col-10_md-12">
        <nav id="site-nav" role="navigation">

          <div v-if="logoButton" class="nav-link nav-link-container logo-button-mobile">
            <a :href="logoButton.href">
              <img class="logo" src="~assets/images/filecoin-logo-horizontal.svg" />
            </a>
          </div>

          <div class="site-nav-inner">
            <component
              :is="button.logo || button.current ? 'div' : 'a'"
              v-for="(button, index) in buttons"
              :key="index"
              :href="button.logo ? false : button.href"
              :target="button.logo ? false : '_blank'"
              :class="['nav-link', { 'nav-link-container logo-button': button.logo, current: button.current }]">
              <template v-if="button.logo">
                <a :href="button.href">
                  <img class="logo" src="~assets/images/filecoin-logo-horizontal.svg" />
                </a>
              </template>
              <template v-else>
                <span class="button-text">{{ button.label }}</span>
              </template>
            </component>
          </div>

        </nav>
      </div>
    </div>
  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  computed: {
    ...mapGetters({
      navigationLinks: 'global/navigationLinks'
    }),
    buttons () {
      return this.navigationLinks
    },
    logoButton () {
      const button = this.buttons.find(obj => obj.href === '/')
      if (button) { return button }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid $silver;
  @include small {
    flex-direction: column;
    align-items: center;
  }
}

.site-nav-inner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  @include mini {
    flex-wrap: wrap;
    width: 100%;
  }
}

.nav-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2rem;
  color: $dodgerBlue;
  @include containerMaxMQ {
    padding: 1rem;
  }
  @include mini {
   justify-content: center;
   width: 33.333%;
   padding-bottom: 0.75rem;
   padding-top: 0.25rem;
   font-size: 0.75rem;
  }
  &:not(.nav-link-container):not(.current) {
    &:hover {
      .button-text {
        &:after {
          width: 100%;
        }
      }
    }
  }
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }
  &.current {
    color: $scorpion;
    cursor: default;
  }
  &.logo-button {
    @include small {
      display: none;
    }
  }
}

.nav-link-container {
  display: block;
  flex: 1;
  text-align: center;
  a {
    display: inline-block;
    &:hover {
      transform: scale(1.05);
    }
  }
}

.logo-button-mobile {
  display: none;
  @include small {
    display: flex;
    padding: 0;
    padding-bottom: 0.25rem;
    margin-top: 1rem;
  }
  .logo {
    @include small {
      width: 8rem;
    }
  }
}

.button-text {
  display: inline-block;
  position: relative;
  white-space: nowrap;
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 0;
    height: 1px;
    background-color: $dodgerBlue;
    transition: width 300ms ease-in-out;
  }
}

.logo {
  display: inline-block;
  width: 10rem;
}
</style>
