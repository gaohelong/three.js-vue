<template>
  <section class="container">
    <div>单击事件</div>
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
import aircraftImg from '@/assets/aircraft.jpg'
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
      // 将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      // 新建一个三维单位向量 假设z方向就是0
      // 根据照相机，把这个向量转换到视点坐标系
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(camera)

      // 在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
      raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())

      // 射线和模型求交，选中一系列直线
      const intersects = raycaster.intersectObjects(scene.children)
      // console.log('imtersrcts=' + intersects)

      if (intersects.length > 0) {
        // 选中第一个射线相交的物体
        // SELECTED = intersects[0].object
        // const intersected = intersects[0].object
        console.log(intersects[0].object)
        // console.log(intersects[0].object.geometry)
        // console.log(intersects[0].object.geometry.type)
        if (intersects[0].object.geometry && intersects[0].object.geometry.type === 'PlaneGeometry') {
          console.log(intersects[0].object.geometry.name)
        }
      }
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
      // renderer.shadowMap.enabled = true // 设置是否开启投影, 开启的话, 光照会产生投影
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap // 设置投影类型, 这边的柔和投影

      /* 场景 */
      scene = new THREE.Scene()

      // 非PC端, 只添加一个天空光, 天空光从正上方往下照, 可以照出明暗对比, 但是不产生阴影
      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 1.6)
      scene.add(hemisphereLight)

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
      scene.add(mesh) // 往场景里添加材质.

      /* 添加物体 */
      const map1 = await loader.load(
        aircraftImg, // 本地图片
        // onLoad回调
        function (texture) {
          return texture
        }
      )

      // 平面几何体
      const geometry = new THREE.PlaneGeometry(1, 1, 1)
      geometry.name = 'fly-yibao'
      geometry.rotateX(1)
      geometry.rotateY(1)
      geometry.rotateZ(1)
      // geometry.translate(0, 1)
      const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        map: map1
      }))

      object.position.x = 1
      object.position.y = 0
      object.position.z = 0

      object.rotation.x = 0
      object.rotation.y = 0
      object.rotation.z = 0

      // object.scale.x = 1
      // object.scale.y = 1
      // object.scale.z = 1

      scene.add(object)

      /* 渲染 */
      setTimeout(function () {
        renderer.render(scene, camera)
      }, 1000)
      controls.addEventListener('change', () => renderer.render(scene, camera))
      // invalidation.then(() => (controls.dispose(), renderer.dispose()))

      /* 光线投射 */
      // 这个类用于进行raycasting（光线投射）.光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
      // raycaster = new THREE.Raycaster()
      mouse = new THREE.Vector3()

      // 通过摄像机和鼠标位置更新射线
      // raycaster.setFromCamera(mouse, camera)

      // 计算物体和射线的焦点
      // raycaster.intersectObjects(scene.children)
      // const intersects = raycaster.intersectObjects(scene.children)
      // for (let i = 0; i < intersects.length; i++) {
      //   intersects[i].object.material.color.set(0xff0000)
      // }

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
