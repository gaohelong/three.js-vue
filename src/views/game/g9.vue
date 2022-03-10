<template>
  <div class="container">
    <!-- Three.js主体 -->
    <div class="three"></div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import enImg1 from '@/assets/exhibition/12.jpeg'
  import enImg2 from '@/assets/exhibition/2.jpeg'
  import enImg3 from '@/assets/exhibition/3.jpeg'
  import enImg4 from '@/assets/exhibition/4.jpeg'
  import enImg5 from '@/assets/exhibition/5.jpeg'

  let camera, scene, renderer
  let touchBeginPosition = new THREE.Vector2(0, 0)
  let touchMovePosition = new THREE.Vector2(0, 0)
  let touchEndPosition = new THREE.Vector2(0, 0)
  // let cameraY = 36
  const cameraZUp = 22 // 前进最大值
  const cameraZDown = 40 // 后退最大值
  // let cameraUpZ = 0
  // let cameraDownZ = 0
  const cameraRightDegMax = -Math.PI / 1 // 限制右侧移动角度
  const cameraLeftDegMax = Math.PI / 1 // 限制左侧移动家都

  export default {
    name: 'game-9',
    data() {
      return {}
    },
    methods: {
      /**
       * 初始化
       */
      init() {
        /* --- 创建场景对象Scene --- */
        scene = new THREE.Scene()

        /* --- 相机-透视 --- */
        const width = window.innerWidth // 窗口宽度
        const height = window.innerHeight // 窗口高度
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000)
        camera.position.set(0, 0, -10)
        // camera.position.set(0, 400, 200)
        // camera.position.x = 20
        // camera.position.y = 40
        // camera.position.z = 50
        camera.lookAt(scene.position)
        scene.add(camera)

        /* --- 相机-正投 --- */
        // const width = window.innerWidth // 窗口宽度
        // const height = window.innerHeight // 窗口高度
        // const k = width / height // 窗口宽高比
        // const s = 150 // 三维场景显示范围控制系数，系数越大，显示的范围越大
        // camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000)
        // camera.position.set(200, 300, 200) // 设置相机位置
        // camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

        /* --- 灯光-自然光 --- */
        const spotLight = new THREE.AmbientLight(0xffffff)
        // spotLight.position.set(30, 40, 100)
        scene.add(spotLight)

        /* --- render --- */
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        })
        // renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0))
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMapEnabled = true
        const canvasEle = document.querySelector('.three')
        canvasEle.appendChild(renderer.domElement) // body元素中插入canvas对象

        this.initObjects()
        this.render()

        /* --- 触摸事件 --- */
        console.log(touchBeginPosition, touchMovePosition, touchEndPosition)

        /* 触摸开始 */
        canvasEle.addEventListener('touchstart', (e) => {
          const pageX = e.changedTouches[0].pageX
          const pageY = e.changedTouches[0].pageY
          touchBeginPosition = new THREE.Vector2(pageX, pageY)
          // console.log('touchstart', touchBeginPosition, touchBeginPosition.x)
          this.positionMove('touchstart')
        }, true)

        /* 触摸移动 */
        renderer.domElement.addEventListener('touchmove', (e) => {
          e.preventDefault()
          const pageX = e.changedTouches[0].pageX
          const pageY = e.changedTouches[0].pageY
          touchMovePosition = new THREE.Vector2(pageX, pageY)
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
       * 房子墙壁初始化
       */
      initObjects() {
        this.paintFloor()

        /* --- 画墙一般y取高度的1/2 --- */
        this.paintWalls(enImg2, 100, 2, 50, 0, 13, -50, 1 / 2, 0) // 后面墙
        this.paintWalls(enImg3, 100, 2, 50, 0, 13, 50, 1 / 2, 0) // 前面墙
        this.paintWalls(enImg4, 105, 2, 50, -50, 13, 0, 1 / 2, 0, 1 / 2) // 左面墙
        this.paintWalls(enImg5, 105, 2, 50, 50, 13, 0, 1 / 2, 0, 1 / 2) // 右面墙
      },
      /**
       *
       */
      render() {
        requestAnimationFrame(this.render)
        renderer.render(scene, camera)
      },
      /**
       * 地板
       */
      paintFloor() {
        /* --- 纹理加载器 --- */
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(enImg1, function(texture) {
          // x和y超过图片像素之后重复绘制图片
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          // 设置地板重复绘制的密度是1 * 1
          texture.repeat.set(1, 1)

          // 设置材质是双面材质
          const material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide
          })

          // 创建普通的平面几何体
          const gemotery = new THREE.PlaneGeometry(100, 100)

          // 创建网格对象
          const mesh = new THREE.Mesh(gemotery, material)
          mesh.position.y = -10
          mesh.rotation.x = Math.PI / 2
          scene.add(mesh)
        })
      },
      /**
       * 墙壁
       * depth — Z轴上面的深度，默认值为1。
       */
      paintWalls(img, width, depth, height, x, y, z, rotationX, rotationY, rotationZ) {
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(img, function(texture) {
          // x和y超过图片像素之后重复绘制图片
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping

          // 设置地板重复绘制的密度是1 * 1
          texture.repeat.set(1, 1)

          const material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide
          })

          // 创建长方体几何体
          const gemotery = new THREE.BoxGeometry(width, depth, height)

          // 创建网格对象以及进行位置的设定
          const mesh = new THREE.Mesh(gemotery, material)
          mesh.position.set(x, y, z)
          mesh.rotation.x = Math.PI * rotationX
          mesh.rotation.y = Math.PI * rotationY
          if (rotationZ) {
            mesh.rotation.z = Math.PI * rotationZ
          }

          scene.add(mesh)
        })
      },
      /**
       * 触摸: 判断前、后、左、右移动
       */
      positionMove(type) {
        if (type === 'touchstart') { // 触摸开始
          console.clear()
          console.log('touchstart', touchBeginPosition, touchBeginPosition.x)
        } else if (type === 'touchmove') { // 触摸移动
          const moveY = touchMovePosition.y // 移动的y值
          const moveX = touchMovePosition.x // 移动的x值
          const Y = moveY - touchBeginPosition.y
          const X = moveX - touchBeginPosition.x

          if (Math.abs(X) > Math.abs(Y) && X > 0) { // 右
            if (camera.rotation.y >= cameraRightDegMax) {
              camera.rotateY(-Math.PI / 180) // 绕-y轴旋转π / 180
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              // console.log(cameraRightDegMax, camera.rotation.y)
            }
          } else if (Math.abs(X) > Math.abs(Y) && X < 0) { // 左
            if (camera.rotation.y <= cameraLeftDegMax) {
              camera.rotateY(Math.PI / 180) // 绕y轴旋转π / 180
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              // console.log(cameraLeftDegMax, camera.rotation.y)
            }
          } else if (Math.abs(Y) > Math.abs(X) && Y > 0) { // 后
            if (cameraZDown > Math.abs(camera.position.z)) {
              camera.translateZ(1)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
            // console.log('down: ', camera.position.z)
          } else if (Math.abs(Y) > Math.abs(X) && Y < 0) { // 前
            if (cameraZUp > camera.position.z) {
              camera.translateZ(-1)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
            // console.log('up: ', camera.position.z)
          }

          renderer.render(scene, camera)

          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
        } else if (type === 'touchend') { // 触摸结束
          console.log('touchend', touchEndPosition, touchEndPosition.x)
          this.directionCls = 'direction-def'
        }
      }
    },
    mounted() {
      window.document.title = '3D-简易房子'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  @import '../../common.less';

  .container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.5);
    user-select: none;
  }

  .three {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 101;
    user-select: none;
  }
</style>
