<template>
  <div class="three">
  </div>
</template>

<script>
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/js/controls/OrbitControls.js'

let camera, scene, renderer
let geometry, material, mesh

export default {
  name: 'Three1',
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

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.querySelector('.three').appendChild(renderer.domElement)
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
  beforeDestroy () {
    document.querySelector('.three').removeChild(renderer.domElement)
  }
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
