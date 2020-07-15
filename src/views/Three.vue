<template>
  <div class="three">
    <div class="list">
      <div class="item">
        <router-link to="/three1">第一个示例：正方体旋转</router-link>
      </div>
      <div class="item">
        <router-link to="/three2">第二个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three3">第三个示例</router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Three',
  data () {
    return {}
  },
  methods: {},
  mounted () {},
  beforeDestroy () {}
}
</script>

<style lang="less" scoped>
</style>
