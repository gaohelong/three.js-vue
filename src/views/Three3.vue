<template>
  <div class="three">
    <div class="list">
      <div class="item">
        <router-link to="/three-1">第一个示例：正方体旋转</router-link>
      </div>
      <div class="item">
        <router-link to="/three-2">第二个示例</router-link>
      </div>
      <div class="item">
        <router-link to="/three-3">第三个示例</router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/js/controls/OrbitControls.js'

let camera, scene, renderer
let geometry, material, mesh

export default {
  name: 'Three3',
  data () {
    return {}
  },
  methods: {
    async init () {
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
      camera.position.z = 1

      scene = new THREE.Scene()

      geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      material = new THREE.MeshNormalMaterial()

      mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(renderer.domElement)
    },
    animate () {
      requestAnimationFrame(this.animate)

      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.02

      renderer.render(scene, camera)
    }
  },
  mounted () {
    this.init()
    this.animate()
  },
  beforeDestroy () {}
}
</script>

<style lang="less" scoped>
  .list {
    .item {
      line-height: 36px;
      font-size: 16px;
      text-align: left;
      border-bottom: 1px solid #ccc;
    }
  }
</style>
