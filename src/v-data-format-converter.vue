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
  name: 'VDataFormatConverter',
  props: {
    value: {
      type: Number,
      required: true
    },
    viewName: {
      type: Boolean
    },
    viewUnit: {
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
    converted () {
      const convertedVal = this.$byteConverter.convert(this.value, this.from, this.to)
      const options = {}
      if (this.minimumFractionDigits >= 0 && this.minimumFractionDigits <= 20) {
        options.minimumFractionDigits = this.minimumFractionDigits
      }
      if (this.maximumFractionDigits >= 0 && this.maximumFractionDigits <= 20) {
        options.maximumFractionDigits = this.maximumFractionDigits
      }
      return (this.localize ? convertedVal.toLocaleString(this.locale, options) : convertedVal)
    },
    toAsName () {
      return this.$byteConverter.getDataFormat(this.to).name
    }
  }
}
</script>

<style scoped>

</style>
