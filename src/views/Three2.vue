<template>
  <section class="container">
    <div class="three"></div>
    <section>
      <button class="btn" @click="reset">重置</button>
      <button class="btn" @click="freeMove(false)">水平移动</button>
      <button class="btn" @click="freeMove(true)">自由移动</button>
    </section>
  </section>
</template>

<script>
import * as THREE from 'three'
import img2k from '@/assets/2k_earth_daymap.jpg'
const OrbitControls = require('three-orbit-controls')(THREE)

let renderer, controls, camera
let mesh

export default {
  name: 'Three2',
  data () {
    return {}
  },
  methods: {
    reset () {
      controls.reset()
    },
    freeMove (type) {
      if (type) {
        // 自由移动.
        controls.minPolarAngle = 0 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
        controls.maxPolarAngle = Math.PI // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。
      } else {
        // 限制水平移动.
        controls.minPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
        controls.maxPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。
      }

      controls.reset()
    },
    async init () {
      /* 初始化渲染实例及设置 */
      renderer = new THREE.WebGLRenderer({
        alpha: true, // canvas是否包含alpha (透明度)。默认为 false
        premultipliedAlpha: false // renderer是否假设颜色有 premultiplied alpha. 默认为true
        // antialias: true // 抗锯齿
      })
      const size = Math.min(window.innerWidth, 600)
      renderer.setSize(size, size)
      renderer.setPixelRatio(window.devicePixelRatio)

      /* 场景 */
      const scene = new THREE.Scene()

      /* 相机 */
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000).translateZ(2.8)
      // camera.position.set(1, 0, 2.8) // 设置摄像机的位置
      // camera.lookAt(camera.position) // 设置摄像机观察的方向
      // camera.filmOffset = 100 // 水平偏离中心偏移量，和.filmGauge单位相同。默认值为0。
      camera.screenSpacePanning = false

      /* 控制器 */
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableZoom = false // 启用或禁用摄像机的缩放。
      controls.maxZoom = 1 // 你能够将相机缩小多少
      controls.panSpeed = 1 // 位移的速度，其默认值为1。
      controls.minDistance = 0 // 你能够将相机向内移动多少（仅适用于PerspectiveCamera），其默认值为0。
      controls.maxDistance = 10 // 你能够将相机向外移动多少（仅适用于PerspectiveCamera），其默认值为Infinity。

      // controls.minAzimuthAngle = -Infinity //
      // controls.maxAzimuthAngle = Infinity //

      /* 本地图片、网络获取图片 */
      const loader = new THREE.TextureLoader()
      const map = await loader.load(
        // 资源URL
        // 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg', // 网络获取图片
        img2k, // 本地图片
        // onLoad回调
        function (texture) {
          return texture
        },
        undefined,
        // onError回调
        function (error) {
          console.error('An error happened.', error)
        }
      )

      /* 材质 */
      mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 32, 32), new THREE.MeshBasicMaterial({
        map
      }))
      // mesh.rotation.x = 1
      // mesh.rotation.y = 10
      // mesh.rotation.z = 10
      scene.add(mesh)

      /* 渲染 */
      setTimeout(function () {
        renderer.render(scene, camera)
      }, 300)
      controls.addEventListener('change', () => renderer.render(scene, camera))
      // invalidation.then(() => (controls.dispose(), renderer.dispose()))

      document.querySelector('.three').appendChild(renderer.domElement)
      // document.body.appendChild(renderer.domElement)
    },
    async loadTexture (url) {
      const loader = new THREE.TextureLoader()
      return url => new Promise(resolve => loader.load(url, resolve))
    }
  },
  async mounted () {
    await this.init()
  },
  beforeDestroy () {
    controls.dispose()
    renderer.dispose()
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

  .btn {
    display: block;
    line-height: 40px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 0.5rem;
    font-size: 16px;
    letter-spacing: 2px;
    outline: none;
    cursor: pointer;
    background-color: #1f3b74;
    color: #ffffff;
  }
</style>
