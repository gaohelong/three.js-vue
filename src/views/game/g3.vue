<template>
  <div class="container">
    <div class="direction">{{ direction }}</div>
    <div class="three"></div>
    <div class="role"></div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import roleImg from '@/assets/exhibition/1.jpeg'
  import enImg1 from '@/assets/exhibition/2.jpeg'
  import enImg2 from '@/assets/exhibition/3.jpeg'
  import enImg3 from '@/assets/exhibition/4.jpeg'
  const OrbitControls = require('three-orbit-controls')(THREE)
  // import { OrbitControls } from 'three/examples/js/controls/OrbitControls.js'

  let camera, scene, renderer
  let geometry, mesh
  let touchBeginPosition = new THREE.Vector2(0, 0)
  let touchMovePosition = new THREE.Vector2(0, 0)
  let touchEndPosition = new THREE.Vector2(0, 0)
  // let cameraY = 36
  let cameraZ = 7000
  let cameraUpZ = 0
  let cameraDownZ = 0

  export default {
    name: 'game-3',
    data() {
      return {
        direction: ''
      }
    },
    methods: {
      /**
       * 初始化
       */
      init() {
        /* --- 创建场景对象Scene --- */
        scene = new THREE.Scene()

        /* --- 纹理加载器 --- */
        const textureLoader = new THREE.TextureLoader()

        /* --- 纹理贴图映射到一个矩形平面上 --- */
        // const geometry = new THREE.BoxGeometry(100, 100, 100) // 立方体
        // const geometry = new THREE.SphereGeometry(60, 25, 25) // 球体
        // geometry = new THREE.BoxGeometry(100, 100, 100) // 立方体
        // console.log(geometry.faces)

        /* --- 角色 --- */
        geometry = new THREE.SphereGeometry(60, 25, 25) // 球体
        const texture = textureLoader.load(roleImg) // 加载图片，返回Texture对象
        const material = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
          map: texture // 设置纹理贴图
        })
        mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
        mesh.position.set(0, 0, 2000)
        // scene.add(mesh) // 网格模型添加到场景中

        /* --- 左侧墙面纹理 --- */
        const geometry1 = new THREE.PlaneGeometry(1920, 1080) // 矩形平面
        const texture1 = textureLoader.load(enImg1) // 加载图片，返回Texture对象
        const material1 = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
          map: texture1 // 设置纹理贴图
        })
        const mesh1 = new THREE.Mesh(geometry1, material1) // 网格模型对象Mesh
        mesh1.position.set(0, 0, 0)
        scene.add(mesh1) // 网格模型添加到场景中

        /* --- 正前方墙面纹理 --- */
        const geometry2 = new THREE.PlaneGeometry(1920, 1080) // 矩形平面
        const texture2 = textureLoader.load(enImg2) // 加载图片，返回Texture对象
        const material2 = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
          map: texture2 // 设置纹理贴图
        })
        const mesh2 = new THREE.Mesh(geometry2, material2) // 网格模型对象Mesh
        mesh2.position.set(-1450, 0, 820)
        mesh2.rotateY(45)
        // mesh.rotateY(Math.PI / -4)
        scene.add(mesh2) // 网格模型添加到场景中

        /* --- 右侧墙面纹理 --- */
        const geometry3 = new THREE.PlaneGeometry(1920, 1080) // 矩形平面
        const texture3 = textureLoader.load(enImg3) // 加载图片，返回Texture对象
        const material3 = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
          map: texture3 // 设置纹理贴图
        })
        const mesh3 = new THREE.Mesh(geometry3, material3) // 网格模型对象Mesh
        mesh3.position.set(1450, 0, 820)
        mesh3.rotateY(-45)
        scene.add(mesh3) // 网格模型添加到场景中

        // 纹理贴图加载成功后，调用渲染函数执行渲染操作
        // reRender()

        /* --- 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置 --- */
        const axisHelper = new THREE.AxisHelper(250)
        scene.add(axisHelper)

        /* --- 创建相机对象-正视 --- */
        const width = window.innerWidth // 窗口宽度
        const height = window.innerHeight // 窗口高度
        const k = width / height // 窗口宽高比
        // const s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大
        // const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 2000)
        // camera.position.set(200, 300, 200) // 设置相机位置
        // camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

        /* --- 创建相机对象-透视 --- */
        camera = new THREE.PerspectiveCamera(45, k, 0.1, 100000)
        // camera.position.set(0, 0, -1000) // 设置相机位置
        camera.position.set(0, 0, 7000) // 设置相机位置
        camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

        /* --- 创建渲染器对象 --- */
        renderer = new THREE.WebGLRenderer({
          alpha: true, // canvas是否包含alpha (透明度)。默认为 false
          // premultipliedAlpha: false, // renderer是否假设颜色有 premultiplied alpha. 默认为true
          antialias: true // 抗锯齿
        })
        renderer.setSize(width, height) // 设置渲染区域尺寸
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setClearColor(0xcbddfd, 1) // 设置背景颜色
        const canvasEle = document.querySelector('.three')
        canvasEle.appendChild(renderer.domElement) // body元素中插入canvas对象

        /* 执行渲染操作指定场景、相机作为参数 */
        setTimeout(function () {
          renderer.render(scene, camera)
        }, 200)

        /* 鼠标操作三维场景旋转、缩放 */
        const reRender = () => {
          console.log(camera)
          renderer.render(scene, camera) // 执行渲染操作
        }
        reRender()

        /* --- 控制器 --- */
        const roleEle = document.querySelector('.role')
        // const controls = new THREE.OrbitControls(camera, renderer.domElement) // 创建控件对象
        const controls = new OrbitControls(camera, roleEle) // 创建控件对象
        controls.addEventListener('change', reRender) // 监听鼠标、键盘事件

        controls.enableZoom = false // 启用或禁用摄像机的缩放。
        controls.maxZoom = 1 // 你能够将相机缩小多少
        controls.panSpeed = 1 // 位移的速度，其默认值为1。
        controls.minDistance = 0 // 你能够将相机向内移动多少（仅适用于PerspectiveCamera），其默认值为0。
        controls.maxDistance = 100000 // 你能够将相机向外移动多少（仅适用于PerspectiveCamera），其默认值为Infinity。

        /* 限制水平移动 */
        controls.minAzimuthAngle = -Infinity
        controls.maxAzimuthAngle = Infinity
        controls.minPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
        controls.maxPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。

        /* 限制左右旋转角度 */
        controls.minAzimuthAngle = -Math.PI / 4
        controls.maxAzimuthAngle = Math.PI / 4

        controls.reset()

        /* 键盘操作 */
        window.addEventListener('keydown', function(e) {
          // console.log(e)
          const key = e.key // 当前键盘按键
          if (key === 'w') { // 前
            console.log('前')
            // cameraZ -= 30
            // camera.position.z = cameraZ
            cameraUpZ -= 10
            camera.translateZ(cameraUpZ)
            console.log('up:', cameraUpZ)
            camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            // camera.lookAt(scene.position)
            renderer.render(scene, camera) // 渲染
          } else if (key === 's') { // 后
            console.log('后')
            // cameraZ += 30
            // camera.position.z = cameraZ
            cameraDownZ += 10
            camera.translateZ(cameraDownZ)
            console.log('down: ', cameraDownZ)
            camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            // camera.lookAt(scene.position)
            renderer.render(scene, camera) // 渲染
          } else if (key === 'a') { // 左
            console.log('左')
            camera.rotateY(Math.PI / 180) // 绕y轴旋转π / 180
            // camera.position.y = Math.PI / 180
            camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            renderer.render(scene, camera) // 渲染
          } else if (key === 'd') { // 右
            console.log('右')
            camera.rotateY(-Math.PI / 180) // 绕-y轴旋转π / 180
            // camera.position.y = -Math.PI / 180
            camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            renderer.render(scene, camera) // 渲染
          }
        })

        /* --- 触摸事件 --- */
        console.log(touchBeginPosition, touchMovePosition, touchEndPosition)

        /* 触摸开始 */
        canvasEle.addEventListener('touchstart', (e) => {
          const clientX = e.changedTouches[0].clientX
          const clientY = e.changedTouches[0].clientY
          touchBeginPosition = new THREE.Vector2(clientX, clientY)
          // console.log('touchstart', touchBeginPosition, touchBeginPosition.x)
          this.positionMove('touchstart')
        }, true)

        /* 触摸移动 */
        renderer.domElement.addEventListener('touchmove', (e) => {
          e.preventDefault()
          const clientX = e.changedTouches[0].clientX
          const clientY = e.changedTouches[0].clientY
          touchMovePosition = new THREE.Vector2(clientX, clientY)
          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
          this.positionMove('touchmove')
        }, true)

        /* 触摸结束 */
        canvasEle.addEventListener('touchend', (e) => {
          const clientX = e.changedTouches[0].clientX
          const clientY = e.changedTouches[0].clientY
          touchEndPosition = new THREE.Vector2(clientX, clientY)
          // console.log('touchend', touchEndPosition, touchEndPosition.x)
          this.positionMove('touchend')
        }, true)
      },
      /**
       * 键盘: 判断前、后、左、右移动
       */
      keyboardPositionMove() {

      },
      /**
       * 触摸: 判断前、后、左、右移动
       */
      positionMove(type) {
        if (type === 'touchstart') { // 触摸开始
          console.log('touchstart', touchBeginPosition, touchBeginPosition.x)
        } else if (type === 'touchmove') { // 触摸移动
          const beginY = touchBeginPosition.y // 开始的y值
          const beginX = touchBeginPosition.x // 开始的x值
          const moveY = touchMovePosition.y // 移动的y值
          const moveX = touchMovePosition.x // 移动的x值
          let upDownRange = 0 // 上下容错区间
          const upDownMax = 10 // 上下容错区间
          let leftRightRange = 0 // 左右容错区间
          const leftRightMax = 10 // 左右容错区间最大值

          // console.log('beginY: ', beginY, 'moveY: ', moveY, 'beginX: ', beginX, 'moveX: ', moveX)
          // console.log('upDownRange: ', upDownRange, 'leftRightRange: ', leftRightRange)

          if (moveY < beginY) { // 前->移动中的y小于初始的y
            leftRightRange = Math.abs(beginX - moveX)
            upDownRange = Math.abs(beginY - moveY)
            // console.log(leftRightRange)
            if (leftRightRange > leftRightMax) {
              if (moveX < beginX) { // 左->移动中的x小于初始的x
                this.direction = '左'
                camera.rotateY(Math.PI / 180) // 绕y轴旋转π / 180
                camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              }
            } else if (upDownRange > upDownMax) {
              this.direction = '前'
              cameraZ = cameraZ - 100
              camera.position.z = cameraZ // 设置相机Z轴位置位置
              // camera.lookAt(scene.position)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
          } else if (moveY > beginY) { // 后->移动中的y大于初始的y
            leftRightRange = Math.abs(beginX - moveX)
            upDownRange = Math.abs(beginY - moveY)
            // console.log(leftRightRange)
            if (leftRightRange > leftRightMax) {
              if (moveX > beginX) { // 右->移动中的x大于初始的x
                this.direction = '右'
                camera.rotateY(-Math.PI / 180) // 绕-y轴旋转π / 180
                camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              }
            } else if (upDownRange > upDownMax) {
              this.direction = '后'
              cameraZ = cameraZ + 100
              camera.position.z = cameraZ // 设置相机Z轴位置位置
              // camera.lookAt(scene.position)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
          }

          // cameraX = 0
          // cameraY = 0
          renderer.render(scene, camera)

          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
        } else if (type === 'touchend') { // 触摸结束
          console.log('touchend', touchEndPosition, touchEndPosition.x)
        }
      }
    },
    mounted() {
      window.document.title = '3D展厅'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
  }

  .direction {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 101;
  }
</style>
