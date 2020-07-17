<template>
  <div class="three">
    <div class="list">
      <div class="item">
        <router-link to="/three2">第一个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three3">第二个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three4">第三个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three5">第四个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three6">第五个示例</router-link>
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
