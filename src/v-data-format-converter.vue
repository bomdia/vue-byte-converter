<template>
  <span>
    <slot v-bind="{...$props,converted,convertedText,toAsName}">
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
  name: 'VDataFormatConverter',
  props: {
    value: {
      type: Number,
      required: true
    },
    viewName: {
      type: Boolean
    },
    viewDataFormat: {
      type: Boolean
    },
    speed: {
      type: Boolean
    },
    from: {
      type: String,
      default: 'B'
    },
    to: {
      type: String,
      default: 'MiB'
    },
    localize: {
      type: Boolean
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
    }
  },
  computed: {
    convertedText () {
      const options = {}
      if (this.minimumFractionDigits >= 0 && this.minimumFractionDigits <= 20) {
        options.minimumFractionDigits = this.minimumFractionDigits
      }
      if (this.maximumFractionDigits >= 0 && this.maximumFractionDigits <= 20) {
        options.maximumFractionDigits = this.maximumFractionDigits
      }
      return (this.localize ? this.converted.toLocaleString(this.locale, options) : this.converted.toString())
    },
    converted () {
      return this.$byteConverter.convert(this.value, this.from, this.to)
    },
    toAsName () {
      return this.$byteConverter.getDataFormat(this.to).name
    }
  }
}
</script>

<style scoped>

</style>
