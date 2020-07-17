<template>
  <section class="container">
    <div>水平移动、y轴旋转</div>
    <div class="three"></div>
    <section>
      <button class="btn" @click="pause(false)">开始</button>
      <button class="btn" @click="pause(true)">暂停</button>
    </section>
  </section>
</template>

<script>
import * as THREE from 'three'
import img2k from '@/assets/2k_earth_daymap.jpg'
const OrbitControls = require('three-orbit-controls')(THREE)

let renderer, controls, camera
let mesh, scene
let requestAnimationFrameVal

export default {
  name: 'Three4',
  data () {
    return {}
  },
  methods: {
    pause (type) {
      this.clearAnimationFrame()
      if (!type) {
        this.rotationY()
      }
    },
    rotationY () {
      mesh.rotateY(0.001) // 每次绕y轴旋转0.01弧度
      requestAnimationFrameVal = window.requestAnimationFrame(this.rotationY) // 请求再次执行渲染函数render
      renderer.render(scene, camera) // 执行渲染操作
    },
    clearAnimationFrame () {
      window.cancelAnimationFrame(requestAnimationFrameVal)
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
      scene = new THREE.Scene()

      /* 相机 */
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000).translateZ(2.8)
      // cameraInitialPosition = camera.position
      // cameraInitialRotation = camera.rotation
      // console.log(cameraInitialPosition, cameraInitialRotation)
      // camera.filmOffset = 1000 // 水平偏离中心偏移量，和.filmGauge单位相同。默认值为0。
      // camera.screenSpacePanning = false // 定义当平移的时候摄像机的位置将如何移动。如果为true，摄像机将在屏幕空间内平移。 否则，摄像机将在与摄像机向上方向垂直的平面中平移。其默认值为false。
      // 设置摄像机的位置
      // camera.position.x = 3
      // camera.position.y = 3
      // camera.position.z = 3
      // 设置摄像机观察的方向
      // camera.lookAt({
      //   x: 0,
      //   y: 1,
      //   z: 0
      // })

      /* 控制器 */
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableZoom = false // 启用或禁用摄像机的缩放。
      controls.maxZoom = 1 // 你能够将相机缩小多少
      controls.panSpeed = 1 // 位移的速度，其默认值为1。
      controls.minDistance = 0 // 你能够将相机向内移动多少（仅适用于PerspectiveCamera），其默认值为0。
      controls.maxDistance = 10 // 你能够将相机向外移动多少（仅适用于PerspectiveCamera），其默认值为Infinity。
      controls.rotateSpeed = 0.5 // 旋转的速度，其默认值为1.

      // 限制水平移动.
      controls.minPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
      controls.maxPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。

      // 视角的最大仰角和俯角
      // controls.minAzimuthAngle = Math.PI / 12
      // controls.maxAzimuthAngle = Math.PI / 2.5

      // controls.autoRotate = true // 自动旋转
      // controls.autoRotateSpeed = 0.5 // 旋转速度

      // angleAzimuthalVal = controls.getAzimuthalAngle() // 获得当前的水平旋转，单位为弧度。
      // polarAngleVal = controls.getPolarAngle() // 获得当前的垂直旋转，单位为弧度。

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
      // mesh.rotation.x = 0
      // mesh.rotation.y = 0
      // mesh.position.z = 0
      mesh.rotateY(100) // 绕y轴旋转100弧度
      scene.add(mesh)

      /* 渲染 */
      setTimeout(function () {
        renderer.render(scene, camera)
      }, 1000)
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
    window.cancelAnimationFrame(requestAnimationFrameVal)
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
