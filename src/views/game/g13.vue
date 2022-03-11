<template>
  <div class="container">
    <!-- Three.js主体 -->
    <div class="three"></div>

    <!-- 旋转区域 -->
    <div class="rotate-wrap">
    </div>

    <!-- 前、后、左、右区域 -->
    <div class="translate-wrap">
      <img class="translate-bg" src="@/assets/cd-bg-s1.png">
      <img :class="'translate-position ' + tpClas" src="@/assets/cd-bg-s2.png">
    </div>

    <!-- 位置还原  -->
    <div class="reset" @click.stop="reset">Rest</div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import floorImg from '@/assets/floor/3.jpeg'
  import ceilingImg from '@/assets/ceiling/1.jpeg'
  import enImg2 from '@/assets/exhibition/2.jpeg'
  import enImg3 from '@/assets/exhibition/3.jpeg'
  import enImg4 from '@/assets/exhibition/4.jpeg'
  import enImg5 from '@/assets/exhibition/5.jpeg'

  let camera, scene, renderer, raycaster
  let wallGroup
  let width, height
  let touchBeginPosition = new THREE.Vector2(0, 0)
  let touchMovePosition = new THREE.Vector2(0, 0)
  let touchEndPosition = new THREE.Vector2(0, 0)
  let raycasterBeginPosition
  // let cameraY = 36
  const cameraZUp = 1000 // 前进最大值
  const cameraZDown = 1000 // 后退最大值
  // let cameraUpZ = 0
  // let cameraDownZ = 0
  const cameraRightDegMax = -Math.PI / 1 // 限制右侧移动角度
  const cameraLeftDegMax = Math.PI / 1 // 限制左侧移动家都
  let cameraTUpLock = false // 平移前进锁
  let cameraTDownLock = false // 平移后退锁
  let cameraTLeftLock = false // 平移左锁
  let cameraTRightLock = false // 平移右锁

  export default {
    name: 'game-13',
    data() {
      return {
        tpClas: 'translate-position-def'
      }
    },
    methods: {
      /**
       * 初始化
       */
      init() {
        width = window.innerWidth // 窗口宽度
        height = window.innerHeight // 窗口高度

        /* --- 创建场景对象Scene --- */
        scene = new THREE.Scene()

        this.createCameraInit() // 创建并初始化相机-透视

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

        this.initObjects()
        setTimeout(() => {
          this.render()
        }, 200)

        /* --- 触摸事件-旋转 --- */
        /* 触摸开始 */
        const rotateEle = document.querySelector('.rotate-wrap')
        rotateEle.addEventListener('touchstart', (e) => {
          const pageX = e.changedTouches[0].pageX
          const pageY = e.changedTouches[0].pageY
          touchBeginPosition = new THREE.Vector2(pageX, pageY)
          // console.log('touchstart', touchBeginPosition, touchBeginPosition.x)
          this.positionMove('r-touchstart')
        }, true)

        /* 触摸移动 */
        rotateEle.addEventListener('touchmove', (e) => {
          e.preventDefault()
          const pageX = e.changedTouches[0].pageX
          const pageY = e.changedTouches[0].pageY
          touchMovePosition = new THREE.Vector2(pageX, pageY)
          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
          this.positionMove('r-touchmove')
        }, true)

        /* 触摸结束 */
        rotateEle.addEventListener('touchend', (e) => {
          const clientX = e.changedTouches[0].clientX
          const clientY = e.changedTouches[0].clientY
          touchEndPosition = new THREE.Vector2(clientX, clientY)
          // console.log('touchend', touchEndPosition, touchEndPosition.x)
          this.positionMove('r-touchend')
        }, true)

        /* --- 触摸事件-平移 --- */
        /* 触摸开始 */
        const translateEle = document.querySelector('.translate-wrap')
        translateEle.addEventListener('touchstart', (e) => {
          const pageX = e.changedTouches[0].pageX
          const pageY = e.changedTouches[0].pageY
          touchBeginPosition = new THREE.Vector2(pageX, pageY)
          // console.log('touchstart', touchBeginPosition, touchBeginPosition.x)
          this.positionMove('t-touchstart')
        }, true)

        /* 触摸移动 */
        translateEle.addEventListener('touchmove', (e) => {
          e.preventDefault()
          const pageX = e.changedTouches[0].pageX
          const pageY = e.changedTouches[0].pageY
          touchMovePosition = new THREE.Vector2(pageX, pageY)
          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
          this.positionMove('t-touchmove')
        }, true)

        /* 触摸结束 */
        translateEle.addEventListener('touchend', (e) => {
          const clientX = e.changedTouches[0].clientX
          const clientY = e.changedTouches[0].clientY
          touchEndPosition = new THREE.Vector2(clientX, clientY)
          // console.log('touchend', touchEndPosition, touchEndPosition.x)
          this.positionMove('t-touchend')
        }, true)
      },
      /**
       * 房子墙壁初始化
       */
      initObjects() {
        wallGroup = new THREE.Group()
        this.paintFloor()

        /* --- 画墙一般y取高度的1/2 --- */
        this.paintWalls(enImg2, 'after-wall', 100, 2, 50, 0, 13, -50, 1 / 2, 0) // 后面墙
        this.paintWalls(enImg3, 'befor-wall', 100, 2, 50, 0, 13, 50, 1 / 2, 0) // 前面墙
        this.paintWalls(enImg4, 'left-wall', 105, 2, 50, -50, 13, 0, 1 / 2, 0, 1 / 2) // 左面墙
        this.paintWalls(enImg5, 'right-wall', 105, 2, 50, 50, 13, 0, 1 / 2, 0, 1 / 2) // 右面墙
      },
      /**
       *
       */
      render() {
        renderer.render(scene, camera)
      },
      /**
       * 地板、天花板
       */
      paintFloor() {
        /* --- 纹理加载器 --- */
        const textureLoader = new THREE.TextureLoader()

        /* 天花板 */
        textureLoader.load(ceilingImg, function(texture) {
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
          mesh.name = 'ceiling'
          mesh.position.y = 35
          mesh.rotation.x = Math.PI / 2
          wallGroup.add(mesh)
          scene.add(wallGroup)
          // scene.add(mesh)
        })

        /* 地板 */
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
          mesh.name = 'floor'
          mesh.position.y = -10
          mesh.rotation.x = Math.PI / 2
          // console.log('floor-mesh position: ', mesh.position) // Vector3{ x: 0, y: -10, z: 0 }
          wallGroup.add(mesh)
          scene.add(wallGroup)
          // scene.add(mesh)
        })
      },
      /**
       * 墙壁
       * depth — Z轴上面的深度，默认值为1。
       */
      paintWalls(img, meshName, width, depth, height, x, y, z, rotationX, rotationY, rotationZ) {
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
          mesh.name = meshName
          mesh.position.set(x, y, z)
          mesh.rotation.x = Math.PI * rotationX
          mesh.rotation.y = Math.PI * rotationY
          // console.log(meshName, mesh.position)
          if (rotationZ) {
            mesh.rotation.z = Math.PI * rotationZ
          }

          wallGroup.add(mesh)
          scene.add(wallGroup)
          // scene.add(mesh)
        })
      },
      /**
       * 触摸: 判断前、后、左、右移动
       */
      positionMove(type) {
        /* --- 旋转 --- */
        if (type === 'r-touchstart') { // 触摸开始
          console.clear()
          console.log('r-touchstart', touchBeginPosition, touchBeginPosition.x)
        } else if (type === 'r-touchmove') { // 触摸移动
          const moveY = touchMovePosition.y // 移动的y值
          const moveX = touchMovePosition.x // 移动的x值
          const Y = moveY - touchBeginPosition.y
          const X = moveX - touchBeginPosition.x

          if (Math.abs(Y) > Math.abs(X) && Y < 0) { // 前
            if (cameraZUp > camera.position.z) {
              camera.rotateX(Math.PI / 180)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
            // console.log('up: ', camera.position.z)
          } else if (Math.abs(Y) > Math.abs(X) && Y > 0) { // 后
            if (cameraZDown > Math.abs(camera.position.z)) {
              camera.rotateX(-Math.PI / 180)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
            // console.log('down: ', camera.position.z)
          } else if (Math.abs(X) > Math.abs(Y) && X < 0) { // 左
            if (camera.rotation.y <= cameraLeftDegMax) {
              camera.rotateY(Math.PI / 180) // 绕y轴旋转π / 180
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              // console.log(cameraLeftDegMax, camera.rotation.y)
            }
          } else if (Math.abs(X) > Math.abs(Y) && X > 0) { // 右
            if (camera.rotation.y >= cameraRightDegMax) {
              camera.rotateY(-Math.PI / 180) // 绕-y轴旋转π / 180
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              // console.log(cameraRightDegMax, camera.rotation.y)
            }
          }

          renderer.render(scene, camera)
          // console.log(scene.position)
          // console.log(camera.position, camera.rotation)

          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
        } else if (type === 'r-touchend') { // 触摸结束
          console.log('r-touchend', touchEndPosition, touchEndPosition.x)
        }

        /* --- 平移 --- */
        if (type === 't-touchstart') { // 触摸开始
          console.clear()
          console.log('t-touchstart', touchBeginPosition, touchBeginPosition.x)
          raycasterBeginPosition = camera.position
          console.log('t-touchstart position: ', camera.position)
        } else if (type === 't-touchmove') { // 触摸移动
          const moveY = touchMovePosition.y // 移动的y值
          const moveX = touchMovePosition.x // 移动的x值
          const Y = moveY - touchBeginPosition.y
          const X = moveX - touchBeginPosition.x

          this.raycasterCheck()
          if (Math.abs(Y) > Math.abs(X) && Y < 0) { // 前
            console.log('t-touchmove position: ', camera.position)
            if (!cameraTUpLock) {
              this.rockerMove('up') // 摇杆移动
              camera.translateZ(-1)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
            // console.log('up: ', camera.position.z)
          } else if (Math.abs(Y) > Math.abs(X) && Y > 0) { // 后
            if (!cameraTDownLock) {
              this.rockerMove('down') // 摇杆移动
              camera.translateZ(1)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
            }
            // console.log('down: ', camera.position.z)
          } else if (Math.abs(X) > Math.abs(Y) && X < 0) { // 左
            if (!cameraTLeftLock) {
              this.rockerMove('left') // 摇杆移动
              camera.translateX(-1)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              // console.log(cameraLeftDegMax, camera.rotation.y)
            }
          } else if (Math.abs(X) > Math.abs(Y) && X > 0) { // 右
            if (!cameraTRightLock) {
              this.rockerMove('right') // 摇杆移动
              camera.translateX(1)
              camera.updateProjectionMatrix() // 更新摄像机投影矩阵
              // console.log(cameraRightDegMax, camera.rotation.y)
            }
          }

          renderer.render(scene, camera)
          // console.log(scene.position)
          // console.log(camera.position, camera.rotation)

          // console.log('touchmove', touchMovePosition, touchMovePosition.x)
        } else if (type === 't-touchend') { // 触摸结束
          console.log('t-touchend', touchEndPosition, touchEndPosition.x)
          this.rockerMove('def')
        }
      },
      /**
       * 摇杆
       */
      rockerMove(type) {
        if (type === 'up') { // 前
          this.tpClas = 'translate-position-up'
        } else if (type === 'down') { // 后
          this.tpClas = 'translate-position-down'
        } else if (type === 'left') { // 左
          this.tpClas = 'translate-position-left'
        } else if (type === 'right') { // 右
          this.tpClas = 'translate-position-right'
        } else { // 中心
          this.tpClas = 'translate-position-def'
        }

        this.render() // 重新渲染
      },
      /**
       * 碰撞检测
       */
      raycasterCheck() {
        // const worldVector = standardVector.unproject(camera) // 标准设备坐标转世界坐标
        // console.log('worldVector: ', worldVector)
        // const ray = worldVector.sub(camera.position).normalize() // 射线投射方向单位向量(worldVector坐标减相机位置坐标)
        // console.log('ray: ', ray)
        // raycaster = new THREE.Raycaster(camera.position, ray) // 创建射线投射器对象
        // raycaster.camera = camera // 设置一下相机

        const cameraX = raycasterBeginPosition.x
        const cameraY = raycasterBeginPosition.y
        const cameraZ = raycasterBeginPosition.z
        const vector = new THREE.Vector3(cameraX, cameraY, cameraZ).unproject(camera)
        raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())

        // 获取与raycaster射线相交的数组集合，其中的元素按照距离排序，越近的越靠前
        // 返回射线选中的对象 第一个参数是检测的目标对象 第二个参数是目标对象的子元素
        const intersects = raycaster.intersectObjects(wallGroup.children, true) // 遍历子元素
        const len = intersects.length
        console.log(len)
        if (len) {
          for (let i = 0; len > i; i++) {
            const curRow = intersects[i]
            if (curRow.object.name === 'after-wall') {
              cameraTUpLock = true
              break
            } else {
              cameraTUpLock = false
            }

            if (curRow.object.name === 'befor-wall') {
              cameraTDownLock = true
              break
            } else {
              cameraTDownLock = false
            }

            if (curRow.object.name === 'left-wall') {
              cameraTLeftLock = true
              break
            } else {
              cameraTLeftLock = false
            }

            if (curRow.object.name === 'right-wall') {
              cameraTRightLock = true
              break
            } else {
              cameraTRightLock = false
            }
          }

          // intersects.map(v => {
          //   console.log(v.object.name)
          // })
        }
      },
      /**
       * 创建并初始化相机-透视
       */
      createCameraInit() {
        /* --- 相机-透视 --- */
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
        // const k = width / height // 窗口宽高比
        // const s = 150 // 三维场景显示范围控制系数，系数越大，显示的范围越大
        // camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000)
        // camera.position.set(200, 300, 200) // 设置相机位置
        // camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)
      },
      /**
       * 重置
       */
      reset() {
        this.createCameraInit()
        this.render()
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

  /* Three.js主体 */
  .three {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 101;
    user-select: none;
  }

  /* 旋转区域 */
  .rotate-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 404/@rem;
    left: 0;
    z-index: 102;
    background-color: rgba(0, 0, 0, 0.2);
    user-select: none;
  }

  /* 前、后、左、右区域 */
  .translate-wrap {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 103;
    height: 404/@rem;
    background-color: rgba(0, 0, 0, 0.1);
    user-select: none;

    .translate-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 104;
      transform: translate(-50%, -50%);
      width: 300/@rem;
      height: 300/@rem;
      user-select: none;
    }

    .translate-position {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 105;
      transform: translate(-50%, -50%);
      width: 110/@rem;
      height: 110/@rem;
      user-select: none;
    }

    .translate-position-def {}

    .translate-position-up {
      top: 134/@rem;
    }

    .translate-position-down {
      top: 268/@rem;
    }

    .translate-position-left {
      left: 348/@rem;
    }

    .translate-position-right {
      left: 478/@rem;
    }
  }

  .reset {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 110;
    width: 100/@rem;
    line-height: 60/@rem;
    font-size: 32/@rem;
    color: @color-FFFFFF;
    user-select: none;
  }
</style>
