<template>
  <span>
    <slot v-bind="{...$props,converted: converted.value,convertedText,to,toAsName}">
      {{ convertedText }}
      <template v-if="viewDataFormat && !viewName">
        {{ to + (speed ? '/s' : '' ) }}
      </template>
      <template v-else-if="!viewDataFormat && viewName">
        {{ toAsName + (speed ? '/s' : '' ) }}
      </template>
      <template v-else-if="viewDataFormat && viewName">
        {{ toAsName + (speed ? '/s' : '' ) + ' (' + to + (speed ? '/s' : '' ) + ')' }}
      </template>
    </slot>
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
    viewDataFormat: {
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
  computed: {
    convertedText () {
      if (this.converted.dataFormat === null || this.converted.value === null) return ''
      const options = {}
      if (this.minimumFractionDigits >= 0 && this.minimumFractionDigits <= 20) {
        options.minimumFractionDigits = this.minimumFractionDigits
      }
      if (this.maximumFractionDigits >= 0 && this.maximumFractionDigits <= 20) {
        options.maximumFractionDigits = this.maximumFractionDigits
      }
      return (this.localize ? this.converted.value.toLocaleString(this.locale, options) : this.converted.value)
    },
    to () {
      if (this.converted.dataFormat !== null) return this.converted.dataFormat
      return ''
    },
    toAsName () {
      if (this.converted.dataFormat !== null) return this.$byteConverter.getDataFormat(this.converted.dataFormat).name
      return ''
    },
    converted () {
      return this.$byteConverter.autoScale(this.value, this.from, this.scaleOptions)
    }
  }
}
</script>

<style scoped>

</style>
