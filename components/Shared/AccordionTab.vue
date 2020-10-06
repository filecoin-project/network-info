<template>
  <section
    v-if="name"
    ref="section"
    :class="['accordion-tab', { open: selected, 'force-active': forceActive }]"
    :style="{ height }">
    <div class="content-wrapper">

      <div
        ref="panelMain"
        class="panel-main"
        @click="$emit('updateRoute', 'accordion-click', tag)">
        <div class="caret"></div>
        <div class="metadata">
          <div class="name">
            {{ name }}
          </div>
          <div class="summary">
            {{ summary }}
          </div>
        </div>
        <div :class="['status', data.Status]">
          <div class="checkmark"></div>
          <div class="triangle"></div>
          <svg class="octagon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
            <path class="octagon-svg-path" d="M240,70V170c-3.92,3.81-7.88,7.57-11.74,11.44Q199.11,210.7,170,240H70c-3.46-3.56-6.87-7.18-10.39-10.68Q29.83,199.64,0,170,0,120,0,70c3.56-3.46,7.18-6.87,10.68-10.39Q40.36,29.83,70,0H170c3.93,4,7.81,8.12,11.79,12.09Q210.87,41.07,240,70Z" />
          </svg>
        </div>
      </div>

      <div ref="panelData" class="panel-data">
        <div class="description" v-html="description">
        </div>
        <template v-for="(key, index) in order">
          <div
            v-if="data.hasOwnProperty(key) && properties.hasOwnProperty(key)"
            :key="index"
            :class="[`data-section top contains-${properties[key].type}-value ${key}`]">

            <div class="label" v-html="highlight(labels.hasOwnProperty(key) ? labels[key] : key)"></div>

            <!-- /////////////////////////////////////////////////// Strings -->
            <template v-if="properties[key].type === 'string'">
              <div class="value" v-html="highlight(data[key])"></div>
            </template>

            <!-- //////////////////////////////////////////////////// Arrays -->
            <template v-else-if="properties[key].type === 'array'">
              <div
                v-for="(arrayItem, arrayItemIndex) in data[key]"
                :key="arrayItemIndex"
                :class="`data-section inner`">

                <template v-if="properties[key].items.type === 'string'">
                  <div class="value" v-html="highlight(arrayItem)"></div>
                </template>

                <template v-else-if="properties[key].items.type === 'object'">
                  <a
                    v-if="arrayItem.hasOwnProperty('Name') && arrayItem.hasOwnProperty('Link')"
                    :href="arrayItem.Link"
                    target="_blank"
                    class="link"
                    v-html="highlight(arrayItem.Name)">
                  </a>
                </template>

              </div>
            </template>

            <!-- /////////////////////////////////////////////////// Objects -->
            <template v-else-if="properties[key].type === 'object'">
              <template v-for="(objectItem, objectItemKey) in data[key]">
                <div
                  v-if="objectItemKey !== 'Base'"
                  :key="objectItemKey"
                  :class="`data-section inner`">

                  <div class="label" v-html="highlight(labels.hasOwnProperty(objectItemKey) ? labels[objectItemKey] : objectItemKey)"></div>

                  <template v-if="properties[key].properties[objectItemKey].type === 'string'">
                    <a
                      v-if="properties[key].properties.hasOwnProperty('Base')"
                      :href="properties[key].properties.Base.examples[0] + objectItem"
                      target="_blank"
                      class="link value"
                      v-html="highlight(objectItem)">
                    </a>
                    <div
                      v-else-if="properties[key].properties.hasOwnProperty('ConsensusMinerMinPower')"
                      class="value"
                      v-html="formatFilesize(objectItem)">
                    </div>
                    <div v-else class="value" v-html="highlight(objectItem)"></div>
                  </template>

                  <template v-if="properties[key].properties[objectItemKey].type === 'integer'">
                    <div class="value" v-html="highlight(objectItem + '')"></div>
                  </template>

                  <template v-if="properties[key].properties[objectItemKey].type === 'object'">
                    <div class="value" v-html="highlight(objectItem['/'])"></div>
                  </template>

                  <template v-if="properties[key].properties[objectItemKey].type === 'array'">
                    <template v-for="(arrayItem, arrayItemIndex) in objectItem">
                      <div
                        v-if="arrayItem.hasOwnProperty('Size')"
                        :key="arrayItemIndex"
                        class="value inline-list"
                        v-html="highlight(formatFilesize(arrayItem.Size))">
                      </div>
                    </template>
                  </template>

                </div>
              </template>
            </template>

          </div>
        </template>

      </div>

    </div>
  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Filesize from 'filesize'
import ToRegex from 'to-regex'

// =================================================================== Functions
const check = (instance, key) => {
  const item = instance.data[key]
  if (item && item !== '') { return item }
  return false
}

const setHeight = (instance, val) => {
  const panelMainHeight = instance.panelMainHeight
  const panelDataHeight = instance.panelDataHeight
  if (val === 'resize') {
    if (instance.selected) {
      if (instance.active !== '' || instance.forceActive) {
        instance.height = panelMainHeight + panelDataHeight + 'px'
      } else {
        instance.height = panelMainHeight + 'px'
      }
    }
  } else if ((typeof val === 'string' && val !== '' && instance.selected) || (typeof val === 'boolean' && val)) {
    instance.height = panelMainHeight + panelDataHeight + 'px'
  } else {
    instance.height = panelMainHeight + 'px'
  }
}

// ====================================================================== Export
export default {
  name: 'AccordionTab',

  props: {
    data: {
      type: Object,
      required: true
    },
    tag: {
      type: String,
      required: true
    },
    active: {
      type: String,
      required: true
    },
    forceActive: {
      type: Boolean,
      required: true
    },
    filterValue: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      height: '0px',
      properties: false,
      order: ['Status', 'Stability', 'Maintainer', 'Git', 'ResourceLinks', 'Genesis', 'NetworkParameters', 'BootstrapPeers'],
      labels: {
        Tag: 'Release Tag',
        NetworkParameters: 'Network Parameters',
        SupportedProofTypes: 'Supported Sector Sizes',
        ConsensusMinerMinPower: 'Consensus Miner Min Power',
        EpochDurationSeconds: 'Epoch Duration Seconds',
        ExpectedLeaderPerEpoch: 'Expected Leaders per Epoch',
        WPoStProvingPeriod: 'WindowPoSt Proving Period',
        WPoStChallengeWindow: 'WindowPoSt Challenge Window',
        WPoStPeriodDeadlines: 'WindowPoSt Period Deadlines',
        PreCommitChallengeDelay: 'Pre-Commit Challenge Delay',
        ResourceLinks: 'Resources',
        Car: 'CAR File',
        Timestamp: 'Reset Timestamp',
        BlockZeroCid: 'Genesis Block CID',
        Sha1Digest: 'sha1 Digest',
        BootstrapPeers: 'Bootstrap Peers'
      },
      resize: false,
      matchList: [],
      panelMainHeight: 0,
      panelDataHeight: 0
    }
  },

  computed: {
    ...mapGetters({
      networkSchema: 'global/networkSchema'
    }),
    name () {
      const name = check(this, 'Name')
      if (name) { return this.$capitalize(name) }
      return false
    },
    summary () {
      return check(this, 'Summary')
    },
    description () {
      return check(this, 'Description')
    },
    selected () {
      if (this.active === this.tag) { return true }
      return false
    }
  },

  watch: {
    active (val) {
      if (this.$refs.section) { setHeight(this, val) }
    },
    forceActive (val) {
      if (this.$refs.section) { setHeight(this, val) }
    }
  },

  mounted () {
    this.properties = this.networkSchema.properties
    if (this.$refs.section) {
      this.$nextTick(() => {
        this.height = this.$refs.panelMain.clientHeight + 'px'
        this.panelMainHeight = this.$refs.panelMain.clientHeight
        this.panelDataHeight = this.$refs.panelData.clientHeight
        const resizeHandler = () => { setHeight(this, 'resize') }
        this.resize = this.$throttle(resizeHandler, 100)
        window.addEventListener('resize', this.resize)
      })
    }
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    formatFilesize (size) {
      return Filesize(size, { standard: 'iec' }).split(' ').join('')
    },
    highlight (value) {
      const filterValue = this.filterValue.toLowerCase()
      if (filterValue !== '' && value.toLowerCase().includes(filterValue)) {
        const regex = ToRegex(filterValue, { contains: true, nocase: true })
        const split = value.split(regex)
        if (split[0] === '') {
          split.shift()
          split[0] = `<mark>${this.$capitalize(filterValue)}</mark>` + split[0]
        }
        const splitAgain = split.join(`<mark>${filterValue}</mark>`).split(' <mark>')
        const len = splitAgain.length
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            splitAgain[i] = this.$capitalize(splitAgain[i])
          }
          return splitAgain.join(' <mark>')
        } else {
          return split.join(`<mark>${filterValue}</mark>`)
        }
      }
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
$caretWidth: 7px;
$caretBorderWidth: 2px;

// ///////////////////////////////////////////////////////////////////// General
.accordion-tab {
  position: relative;
  border-radius: 0.5rem;
  transition: height 250ms ease-out;
  &:before {
    @include shadow6;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    border-radius: 0.5rem;
    transition: 250ms ease-out;
  }
  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
  &:not(.open):not(.force-active) {
    cursor: pointer;
    transition: transform 250ms ease-out, height 250ms ease-in;
    &:hover {
      transition: transform 250ms ease-in, height 250ms ease-out;
      transform: translateY(0.125rem);
      &:before {
        transition: 250ms ease-in;
        opacity: 0.5;
      }
    }
    .caret {
      transform: rotate(-90deg);
      transition: 250ms ease-out;
    }
  }
  &.open,
  &.force-active {
    .panel-main {
      &:after {
        transition: 250ms ease-in;
        width: calc(100% - 3rem - 2.5rem);
      }
    }
    .panel-data {
      transition: opacity 0ms ease-out;
      opacity: 1;
    }
  }
}

.content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

// //////////////////////////////////////////////////////////////// [Panel] Main
.panel-main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 2rem 2.5rem 2rem 3rem;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    top: calc(100% - 1.5rem);
    left: 3rem;
    width: 0;
    height: 1px;
    background-color: #999;
    transition: 250ms ease-out;
  }
}

.caret {
  position: absolute;
  top: 3rem;
  left: 1.5rem;
  width: $caretWidth * 2;
  height: $caretWidth;
  transform: rotate(0);
  transition: 250ms ease-in;
  &:before,
  &:after {
    content: '';
    position: absolute;
  }
  &:before {
    top: 0;
    left: 0;
    border-top: $caretWidth solid #999;
    border-left: $caretWidth solid transparent;
    border-right: $caretWidth solid transparent;
  }
  &:after {
    left: $caretBorderWidth;
    top: 0;
    border-top: $caretWidth - $caretBorderWidth solid white;
    border-left: $caretWidth - $caretBorderWidth solid transparent;
    border-right: $caretWidth - $caretBorderWidth solid transparent;
  }
}

.metadata {
  flex: 1;
  padding-right: 2rem;
}

.name {
  font-size: 1.5rem;
  font-weight: 500;
}

.status {
  position: relative;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  text-align: center;
  &.online {
    .checkmark {
      display: inline-block;
    }
  }
  &.unstable {
    .triangle {
      display: block;
    }
  }
  &.offline {
    .octagon-svg {
      display: block;
    }
  }
}

.checkmark,
.triangle,
.octagon-svg {
  display: none;
}

.checkmark {
  transform: rotate(45deg);
  height: 24px;
  width: 14px;
  border-bottom: 5px solid $jungleGreen;
  border-right: 5px solid $jungleGreen;
}

.triangle {
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-bottom: 24px solid $creamCan;
}

.octagon-svg-path {
  fill: $burntSienna;
  width: 100%;
  height: 100%;
}

// //////////////////////////////////////////////////////////////// [Panel] Data
.panel-data {
  margin: 0 2.5rem 0 3rem;
  padding-bottom: 2rem;
  opacity: 0;
  transition: opacity 250ms ease-out;
}

.data-section {
  margin-bottom: 0.5rem;
  &.inner,
  &.contains-string-value {
    display: flex;
    flex-direction: row;
    .label {
      margin-right: 1rem;
    }
  }
  &.contains-object-value,
  &.contains-array-value {
    > .data-section {
      padding-left: 2rem;
    }
  }
  &.top {
    margin: 1rem 0 0.5rem;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
    > .label {
      margin-bottom: 0.5rem;
    }
  }
  @include mini {
      &.contains-object-value,
      &.contains-array-value {
        > .data-section {
          padding-left: 0.5rem;
      }
    }
  }
}

.label {
  font-weight: 700;
}

.value {
  font: 0.8rem/1.2rem 'courier', 'courier new', monospace;
  word-break: break-all;
  padding-top: 0.35rem;
  &.inline-list {
    display: flex;
    &:not(:last-child) {
      &:after {
        content: ', ';
        margin-right: 0.375rem;
      }
    }
  }
  @include mini {
    padding-top: 0.16rem;
  }
}

.link {
  color: $dodgerBlue;
  &:hover {
    text-decoration: underline;
  }
}
</style>
