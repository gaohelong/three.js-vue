<template>
  <div class="container">
    <!-- Three.js主体 -->
    <div class="three"></div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import floorImg from '@/assets/floor/3.jpeg'
  import enImg2 from '@/assets/exhibition/2.jpeg'
  import enImg3 from '@/assets/exhibition/3.jpeg'
  import enImg4 from '@/assets/exhibition/4.jpeg'
  import enImg5 from '@/assets/exhibition/5.jpeg'
  import rockerImg1 from '@/assets/cd-bg-s1.png'
  import rockerImg2 from '@/assets/cd-bg-s2.png'

  let camera, scene, renderer
  let sprite1, sprite2
  let touchBeginPosition = new THREE.Vector2(0, 0)
  let touchMovePosition = new THREE.Vector2(0, 0)
  let touchEndPosition = new THREE.Vector2(0, 0)
  // let cameraY = 36
  const cameraZUp = 1000 // 前进最大值
  const cameraZDown = 1000 // 后退最大值
  // let cameraUpZ = 0
  // let cameraDownZ = 0
  const cameraRightDegMax = -Math.PI / 1 // 限制右侧移动角度
  const cameraLeftDegMax = Math.PI / 1 // 限制左侧移动家都

  export default {
    name: 'game-11',
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
        // camera.position.set(0, 0, -10)
        // camera.position.set(0, 400, 200)
        camera.position.x = 0
        camera.position.y = 0
        camera.position.z = 20
        camera.lookAt(scene.position)
        scene.add(camera)

        /* 相机-沿Z轴平移 */
        camera.translateY(10)
        camera.updateProjectionMatrix() // 更新摄像机投影矩阵

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

        /* --- 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置 --- */
        const axisHelper = new THREE.AxisHelper(1000)
        scene.add(axisHelper)

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

        this.rockerInit()
        this.initObjects()
        setTimeout(() => {
          this.render()
        }, 200)

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
        renderer.render(scene, camera)
      },
      /**
       * 地板
       */
      paintFloor() {
        /* --- 纹理加载器 --- */
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(floorImg, function(texture) {
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
          // texture.wrapS = texture.wrapT = THREE.RepeatWrapping

          // 设置地板重复绘制的密度是1 * 1
          // texture.repeat.set(1, 1)

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

          if (Math.abs(Y) > Math.abs(X) && Y < 0) { // 前
            if (cameraZUp > camera.position.z) {
              this.rockerMove('up') // 摇杆移动
              camera.translateZ(-1)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
            // console.log('up: ', camera.position.z)
          } else if (Math.abs(Y) > Math.abs(X) && Y > 0) { // 后
            if (cameraZDown > Math.abs(camera.position.z)) {
              this.rockerMove('down') // 摇杆移动
              camera.translateZ(1)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
            // console.log('down: ', camera.position.z)
          } else if (Math.abs(X) > Math.abs(Y) && X < 0) { // 左
            if (camera.rotation.y <= cameraLeftDegMax) {
              this.rockerMove('left') // 摇杆移动
              camera.rotateY(Math.PI / 180) // 绕y轴旋转π / 180
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              // console.log(cameraLeftDegMax, camera.rotation.y)
            }
          } else if (Math.abs(X) > Math.abs(Y) && X > 0) { // 右
            if (camera.rotation.y >= cameraRightDegMax) {
              this.rockerMove('right') // 摇杆移动
              camera.rotateY(-Math.PI / 180) // 绕-y轴旋转π / 180
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              // console.log(cameraRightDegMax, camera.rotation.y)
            }
          }

          renderer.render(scene, camera)
          // console.log(scene.position)
          // console.log(camera.position, camera.rotation)

          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
        } else if (type === 'touchend') { // 触摸结束
          console.log('touchend', touchEndPosition, touchEndPosition.x)
          this.directionCls = 'direction-def'
          this.rockerMove('def')
        }
      },
      /**
       * 摇杆初始化
       */
      rockerInit() {
        // rockerGroup = new THREE.Group() // 创建分组
        // const geometry1 = new THREE.CircleGeometry(1.1, 32)
        // const material1 = new THREE.MeshBasicMaterial({ color: 0xffffff })
        // const circle1 = new THREE.Mesh(geometry1, material1)
        // circle1.translateY(5.2)
        // rockerGroup.add(circle1)

        // const geometry2 = new THREE.CircleGeometry(0.4, 32)
        // const material2 = new THREE.MeshBasicMaterial({ color: 0x2c3e50 })
        // rockerCircle2 = new THREE.Mesh(geometry2, material2)
        // rockerCircle2.translateY(5.2)
        // rockerGroup.add(rockerCircle2)
        // scene.add(rockerGroup)
        // rockerCircle2.translateY(6)
        // rockerGroup.translateY(6)
        // circle.visible = false // 隐藏网格

        /* --- 精灵 --- */
        const textureLoader = new THREE.TextureLoader() // 纹理加载器

        /* 摇杆底图 */
        const texture1 = textureLoader.load(rockerImg1) // 加载图片，返回Texture对象
        const spriteMaterial1 = new THREE.SpriteMaterial({
          // color: 0xff00ff, // 设置精灵矩形区域颜色
          // rotation: Math.PI / 4, // 旋转精灵对象45度，弧度值
          map: texture1 // 设置精灵纹理贴图
        })
        console.log(spriteMaterial1)
        sprite1 = new THREE.Sprite(spriteMaterial1)
        sprite1.scale.set(2.5, 2.5, 2.5)
        sprite1.position.set(0, 5, 0)
        scene.add(sprite1)

        /* 摇杆圆点 */
        const texture2 = textureLoader.load(rockerImg2) // 加载图片，返回Texture对象
        const spriteMaterial2 = new THREE.SpriteMaterial({
          // color: 0xff00ff, // 设置精灵矩形区域颜色
          // rotation: Math.PI / 4, // 旋转精灵对象45度，弧度值
          map: texture2 // 设置精灵纹理贴图
        })
        sprite2 = new THREE.Sprite(spriteMaterial2)
        sprite2.scale.set(1, 1, 1)
        sprite2.position.set(0, 5, 0)
        scene.add(sprite2)
      },
      /**
       * 摇杆移动
       */
      rockerMove(type) {
        if (type === 'up') { // 前
          // rockerCircle2.position.y = 5.89 // 固定位置
        } else if (type === 'down') { // 后
          // rockerCircle2.position.y = 4.51 // 固定位置
        } else if (type === 'left') { // 左
          // rockerCircle2.position.x = -0.68 // 固定位置
        } else if (type === 'right') { // 右
          // rockerCircle2.rotateY(-Math.PI / 180)
          // rockerCircle2.position.x = 0.68 // 固定位置
        } else { // 中心
          // rockerCircle2.position.y = 5.2
        }

        this.render() // 重新渲染
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
