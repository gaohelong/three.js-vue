<template>
  <div class="container">
    <div class="direction">{{ direction }}</div>
    <div class="three"></div>
    <div class="role"></div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import imgAct1 from '@/assets/act.jpg'
  import imgAct2 from '@/assets/act2.jpg'
  import imgAct3 from '@/assets/act3.jpg'
  const OrbitControls = require('three-orbit-controls')(THREE)
  // import { OrbitControls } from 'three/examples/js/controls/OrbitControls.js'

  let camera, scene, renderer
  let geometry, mesh
  let touchBeginPosition = new THREE.Vector2(0, 0)
  let touchMovePosition = new THREE.Vector2(0, 0)
  let touchEndPosition = new THREE.Vector2(0, 0)
  // let cameraX = 0
  // let cameraY = 0
  let cameraZ = -1000

  export default {
    name: 'game-1',
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
        /* 创建场景对象Scene */
        scene = new THREE.Scene()

        /* 纹理贴图映射到一个矩形平面上 */
        // const geometry = new THREE.PlaneGeometry(204, 102) // 矩形平面
        // const geometry = new THREE.BoxGeometry(100, 100, 100) // 立方体
        // const geometry = new THREE.SphereGeometry(60, 25, 25) // 球体
        geometry = new THREE.BoxGeometry(100, 100, 100) // 立方体
        // console.log(geometry.faces)

        // 材质对象1
        const textureLoader = new THREE.TextureLoader() // 纹理加载器
        const texture1 = textureLoader.load(imgAct1) // 加载图片，返回Texture对象
        // 设置阵列模式 默认ClampToEdgeWrapping. RepeatWrapping：阵列; 镜像阵列：MirroredRepeatWrapping
        texture1.wrapS = THREE.RepeatWrapping
        texture1.wrapT = THREE.RepeatWrapping
        texture1.repeat.set(2, 2) // uv两个方向纹理重复数量
        // texture1.offset = new THREE.Vector2(0.3, 0.1) // 不设置重复  偏移范围-1~1
        // texture1.offset = new THREE.Vector2(0.5, 0.5) // 偏移效果
        texture1.rotation = Math.PI / 4 // 设置纹理旋转角度
        // texture1.center.set(0.5, 0.5) // 设置纹理的旋转中心，默认(0,0)
        const material1 = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
          map: texture1 // 设置纹理贴图
        })

        // 材质对象2
        const texture2 = textureLoader.load(imgAct2) // 加载图片，返回Texture对象
        const material2 = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
          map: texture2 // 设置纹理贴图
        })

        // 材质对象3
        const texture3 = textureLoader.load(imgAct3) // 加载图片，返回Texture对象
        const material3 = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
          map: texture3 // 设置纹理贴图
        })

        // 材质对象4
        const material4 = new THREE.MeshPhongMaterial({
          color: 0xffff3f,
          emissive: 0x29af34 // 材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色, 默认为黑色
        })

        // 创建video对象
        const video = document.createElement('video')
        video.src = '/video/cat.mp4' // 设置视频地址
        video.autoplay = 'autoplay' // 要设置播放
        video.loop = true // 循环播放

        // 材质对象5
        const texture5 = new THREE.VideoTexture(video)
        const material5 = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
          map: texture5 // 设置纹理贴图
        })

        // 设置材质数组
        const materialArr = [material1, material2, material3, material4, material5, material4]

        mesh = new THREE.Mesh(geometry, materialArr) // 网格模型对象Mesh
        mesh.position.set(0, 0, 0)
        mesh.rotateX(0)
        // mesh.rotateY(Math.PI / -4)
        scene.add(mesh) // 网格模型添加到场景中

        // 纹理贴图加载成功后，调用渲染函数执行渲染操作
        // reRender()

        /* 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置 */
        const axisHelper = new THREE.AxisHelper(250)
        scene.add(axisHelper)

        /* 相机 */
        const width = window.innerWidth // 窗口宽度
        const height = window.innerHeight // 窗口高度

        // 创建相机对象-正视
        const k = width / height // 窗口宽高比
        // const s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大
        // const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 2000)
        // camera.position.set(200, 300, 200) // 设置相机位置
        // camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

        // 创建相机对象-透视
        camera = new THREE.PerspectiveCamera(45, k, 0.1, 10000)
        camera.position.set(0, 0, -1000) // 设置相机位置
        camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

        /* 创建渲染器对象 */
        renderer = new THREE.WebGLRenderer({
          alpha: true, // canvas是否包含alpha (透明度)。默认为 false
          // premultipliedAlpha: false, // renderer是否假设颜色有 premultiplied alpha. 默认为true
          antialias: true // 抗锯齿
        })
        renderer.setSize(width, height) // 设置渲染区域尺寸
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setClearColor(0xb9d3ff, 1) // 设置背景颜色
        const canvasEle = document.querySelector('.three')
        canvasEle.appendChild(renderer.domElement) // body元素中插入canvas对象

        // 执行渲染操作指定场景、相机作为参数
        setTimeout(function () {
          renderer.render(scene, camera)
        }, 200)

        /* 鼠标操作三维场景旋转、缩放 */
        const reRender = () => {
          // console.log('scene: ', scene)
          // console.log('camera: ', camera)
          // renderer.render(scene, camera) // 执行渲染操作
        }
        reRender()

        const roleEle = document.querySelector('.role')
        // const controls = new THREE.OrbitControls(camera, renderer.domElement) // 创建控件对象
        const controls = new OrbitControls(camera, roleEle) // 创建控件对象
        controls.addEventListener('change', reRender) // 监听鼠标、键盘事件

        /* 触摸事件 */
        console.log(touchBeginPosition, touchMovePosition, touchEndPosition)

        // 触摸开始
        canvasEle.addEventListener('touchstart', (e) => {
          const clientX = e.changedTouches[0].clientX
          const clientY = e.changedTouches[0].clientY
          touchBeginPosition = new THREE.Vector2(clientX, clientY)
          // console.log('touchstart', touchBeginPosition, touchBeginPosition.x)
          this.positionMove('touchstart')
        }, true)

        // 触摸移动
        renderer.domElement.addEventListener('touchmove', (e) => {
          e.preventDefault()
          const clientX = e.changedTouches[0].clientX
          const clientY = e.changedTouches[0].clientY
          touchMovePosition = new THREE.Vector2(clientX, clientY)
          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
          this.positionMove('touchmove')
        }, true)

        // 触摸结束
        canvasEle.addEventListener('touchend', (e) => {
          const clientX = e.changedTouches[0].clientX
          const clientY = e.changedTouches[0].clientY
          touchEndPosition = new THREE.Vector2(clientX, clientY)
          // console.log('touchend', touchEndPosition, touchEndPosition.x)
          this.positionMove('touchend')
        }, true)
      },
      /**
       * 判断前、后、左、右移动
       */
      positionMove(type) {
        if (type === 'touchstart') { // 触摸开始
          console.log('touchstart', touchBeginPosition, touchBeginPosition.x)
        } else if (type === 'touchmove') { // 触摸移动
          const beginY = touchBeginPosition.y // 开始的y值
          const beginX = touchBeginPosition.x // 开始的x值
          const moveY = touchMovePosition.y // 移动的y值
          const moveX = touchMovePosition.x // 移动的x值
          // const upDownRange = 0 // 上下容错区间
          // const leftRightRange = 0 // 左右容错区间

          // console.log('beginY: ', beginY, 'moveY: ', moveY, 'beginX: ', beginX, 'moveX: ', moveX)
          // console.log('upDownRange: ', upDownRange, 'leftRightRange: ', leftRightRange)

          if (moveY < beginY) { // 前->移动中的y小于初始的y
            this.direction = '前'
            cameraZ = cameraZ + 20
            camera.position.z = cameraZ // 设置相机Z轴位置位置
          } else if (moveY > beginY) { // 后->移动中的y大于初始的y
            this.direction = '后'
            cameraZ = cameraZ - 20
            camera.position.z = cameraZ // 设置相机Z轴位置位置
          } else if (moveX < beginX) { // 左->移动中的x小于初始的x
            this.direction = '左'
          } else if (moveX > beginX) { // 右->移动中的x大于初始的x
            this.direction = '右'
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
      window.document.title = '摇杆'
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
