<template>
  <span>
    {{ converted }}
    <template v-if="viewUnit && !viewName">
      {{ to + (speed ? '/s' : '' ) }}
    </template>
    <template v-else-if="!viewUnit && viewName">
      {{ toAsName + (speed ? '/s' : '' ) }}
    </template>
    <template v-else-if="viewUnit && viewName">
      {{ toAsName + (speed ? '/s' : '' ) + ' (' + to + (speed ? '/s' : '' ) + ')' }}
    </template>
  </span>
</template>

<script>
export default {
  name: 'VDataFormatAutoConverter',
  props: {
    value: {
      type: Number,
      required: true
    },
    viewUnit: {
      type: Boolean,
      default: true
    },
    viewName: {
      type: Boolean,
      default: false
    },
    speed: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: 'B'
    },
    localize: {
      type: Boolean,
      default: false
    },
    locale: {
      type: String,
      default: 'en'
    },
    minimumFractionDigits: {
      type: Number,
      default: -1
    },
    maximumFractionDigits: {
      type: Number,
      default: -1
    },
    scaleOptions: {
      type: Object,
      default () { return this.$byteConverter.defaultAutoScaleOptions }
    }
  },
  data () {
    return {
      scaledVal: { value: null, dataFormat: null }
    }
  },
  computed: {
    converted () {
      if (this.scaledVal.dataFormat === null || this.scaledVal.value === null) return ''
      const options = {}
      if (this.minimumFractionDigits >= 0 && this.minimumFractionDigits <= 20) {
        options.minimumFractionDigits = this.minimumFractionDigits
      }
      if (this.maximumFractionDigits >= 0 && this.maximumFractionDigits <= 20) {
        options.maximumFractionDigits = this.maximumFractionDigits
      }
      return (this.localize ? this.scaledVal.value.toLocaleString(this.locale, options) : this.scaledVal.value)
    },
    to () {
      if (this.scaledVal.dataFormat !== null) return this.scaledVal.dataFormat
      return ''
    },
    toAsName () {
      if (this.scaledVal.dataFormat !== null) return this.$byteConverter.getDataFormat(this.scaledVal.dataFormat).name
      return ''
    }
  },
  mounted () {
    this.autoScale()
  },
  methods: {
    autoScale () {
      this.scaledVal = this.$byteConverter.autoScale(this.value, this.from, this.scaleOptions)
    }
  }
}
</script>

<style scoped>

</style>
