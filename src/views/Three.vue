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
      <div class="item">
        <router-link to="/three7">第六个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three8">第七个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three9">第八个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three10">Glft-导入</router-link>
      </div>
      <div class="item">
        <router-link to="/three11">Glft-点击</router-link>
      </div>
      <div class="item">
        <router-link to="/three12">Glft-水平-物体替换-改变物体颜色</router-link>
      </div>
      <div class="item">
        <router-link to="/three13">Glft-水平-物体替换-替换成真实物体</router-link>
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
