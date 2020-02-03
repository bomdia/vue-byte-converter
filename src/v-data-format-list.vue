<template>
  <span>
    <slot :typeList="orderedTypeList">
      <ul>
        <li
          v-for="{dataFormat, name} of typeList"
          :key="dataFormat"
        >
          {{ name + ' (' + dataFormat + ')' }}
        </li>
      </ul>
    </slot>
  </span>
</template>

<script>
export default {
  name: 'VDataFormatList',
  props: {
    isDescendent: { type: Boolean }
  },
  data () {
    return {
      typeList: this.$byteConverter.typeList
    }
  },
  computed: {
    orderedTypeList () {
      const arr = Object.assign([], this.typeList)
      return arr.sort((a, b) => { return this.$byteConverter.compareTo(a.dataFormat, b.dataFormat, this.isDescendent) })
    }
  }
}
</script>

<style scoped>

</style>
