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
  import TrackballControls from 'three-trackballcontrols'
  // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

  let camera, scene, renderer
  let trackballControls, clock

  export default {
    name: 'game-8',
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
        camera.position.set(0, 0, 200)
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
      },
      /**
       *
       */
      initObjects() {
        this.paintFloor()

        /* --- 画墙一般y取高度的1/2 --- */
        this.paintWalls(enImg2, 40, 2, 30, 0, 5, -20, 1 / 2, 0) // 后面墙
        this.paintWalls(enImg3, 40, 2, 30, 0, 5, 20, 1 / 2, 0) // 前面墙
        this.paintWalls(enImg4, 42, 2, 30, -20, 5, 0, 1 / 2, 0, 1 / 2) // 左面墙
        this.paintWalls(enImg5, 42, 2, 30, 20, 5, 0, 1 / 2, 0, 1 / 2) // 右面墙

        this.initTrackballControls()
      },
      /**
       *
       */
      render() {
        requestAnimationFrame(this.render)
        renderer.render(scene, camera)

        /* --- 鼠标事件 --- */
        var delta = clock.getDelta()
        trackballControls.update(delta)
      },
      /**
       *
       */
      initTrackballControls() {
        clock = new THREE.Clock()
        trackballControls = new TrackballControls(camera, renderer.domElement)
        trackballControls.rotateSpeed = 1.0
        trackballControls.zoomSpeed = 1.0
        trackballControls.panSpeed = 1.0
        // trackballControls.noZoom = false
        // trackballControls.noPan = false
        trackballControls.staticMoving = true
        // trackballControls.dynamicDampingFactor = 0.3
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
          const gemotery = new THREE.PlaneGeometry(40, 40)

          // 创建网格对象
          const mesh = new THREE.Mesh(gemotery, material)
          mesh.position.y = -10
          mesh.rotation.x = Math.PI / 2
          scene.add(mesh)
        })
      },
      /**
       * 墙壁
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
