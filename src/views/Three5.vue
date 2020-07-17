<template>
  <section class="container">
    <div class="three" @click="mousemoveProc"></div>
    <section>
      <button class="btn" @click="freeMove(false)">水平移动</button>
      <button class="btn" @click="freeMove(true)">自由移动</button>
      <button class="btn" @click="rotation('x')">绕局部空间的X轴旋转这个</button>
      <button class="btn" @click="rotation('y')">绕局部空间的Y轴旋转这个</button>
      <button class="btn" @click="rotation('z')">绕局部空间的Z轴旋转这个</button>
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
// let angleAzimuthalVal, polarAngleVal
// let cameraInitialPosition, cameraInitialRotation
let raycaster, mouse

export default {
  name: 'Three5',
  data () {
    return {}
  },
  methods: {
    mousemoveProc (e) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      console.log(mouse)
    },
    reset () {
      this.clearAnimationFrame()
      controls.reset()
      // camera.position.set(cameraInitialPosition)
      // camera.rotation.set(cameraInitialRotation)
    },
    freeMove (type) {
      this.clearAnimationFrame()
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
    rotation (type) {
      this.clearAnimationFrame()
      switch (type) {
        case 'x':
          this.rotationX()
          break
        case 'y':
          this.rotationY()
          break
        default:
          this.rotationZ()
      }
    },
    rotationX () {
      mesh.rotateX(0.001) // 每次绕x轴旋转0.01弧度
      requestAnimationFrameVal = window.requestAnimationFrame(this.rotationX) // 请求再次执行渲染函数render
      renderer.render(scene, camera) // 执行渲染操作
    },
    rotationY () {
      mesh.rotateY(0.001) // 每次绕y轴旋转0.01弧度
      requestAnimationFrameVal = window.requestAnimationFrame(this.rotationY) // 请求再次执行渲染函数render
      renderer.render(scene, camera) // 执行渲染操作
    },
    rotationZ () {
      mesh.rotateZ(0.001) // 每次绕z轴旋转0.01弧度
      requestAnimationFrameVal = window.requestAnimationFrame(this.rotationZ) // 请求再次执行渲染函数render
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
      // 视角的最大仰角和俯角
      // controls.minAzimuthAngle = Math.PI / 12
      // controls.maxAzimuthAngle = Math.PI / 2.5
      // controls.autoRotate = true // 自动旋转
      // controls.autoRotateSpeed = 0.5 // 旋转速度
      controls.rotateSpeed = 0.5 // 旋转的速度，其默认值为1.
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

      /* 光线投射 */
      raycaster = new THREE.Raycaster()
      mouse = new THREE.Vector2()
    },
    async loadTexture (url) {
      const loader = new THREE.TextureLoader()
      return url => new Promise(resolve => loader.load(url, resolve))
    },
    animation () {
      // mesh.rotateX(0.001) // 每次绕x轴旋转0.01弧度
      mesh.rotateY(0.001) // 每次绕y轴旋转0.01弧度 - 绕局部空间的Y轴旋转这个物体, 将要旋转的角度（以弧度来表示）
      // mesh.rotateZ(0.001) // 每次绕z轴旋转0.01弧度
      // mesh.translateX(0.001) // 沿着X轴将平移
      // mesh.translateY(0.001) // 沿着Y轴将平移
      // mesh.translateZ(0.001) // 沿着Z轴将平移
      requestAnimationFrameVal = window.requestAnimationFrame(this.animation) // 请求再次执行渲染函数render
      renderer.render(scene, camera) // 执行渲染操作

      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, camera)

      // 计算物体和射线的焦点
      var intersects = raycaster.intersectObjects(scene.children)
      for (var i = 0; i < intersects.length; i++) {
        intersects[i].object.material.color.set(0xff0000)
      }
    }
  },
  async mounted () {
    await this.init()
    this.animation()
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
