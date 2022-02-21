<template>
  <div class="container">
    <div class="three"></div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import imgPf from '@/assets/pf.png'
  const OrbitControls = require('three-orbit-controls')(THREE)
  // import { OrbitControls } from 'three/examples/js/controls/OrbitControls.js'

  // let camera, scene, renderer
  // let geometry, material, mesh
  export default {
    name: 'Three8-1',
    data() {
      return {}
    },
    methods: {
      /**
       * 初始化
       */
      init() {
        /* 创建场景对象Scene */
        const scene = new THREE.Scene()

        /* 纹理贴图映射到一个矩形平面上 */
        // const geometry = new THREE.PlaneGeometry(204, 102) // 矩形平面
        // const geometry = new THREE.BoxGeometry(100, 100, 100) // 立方体
        const geometry = new THREE.SphereGeometry(60, 25, 25) // 球体

        /* TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理 */
        const textureLoader = new THREE.TextureLoader()

        // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
        textureLoader.load(
          imgPf,
          function (texture) {
            const material = new THREE.MeshLambertMaterial({
              // color: 0x0000ff,
              // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
              map: texture // 设置颜色贴图属性值
            }) // 材质对象Material

            const mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
            scene.add(mesh) // 网格模型添加到场景中

            // 纹理贴图加载成功后，调用渲染函数执行渲染操作
            reRender()
          },
          undefined,
          // onError回调
          function (error) {
            console.error('An error happened.', error)
          }
        )

        /* 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置 */
        const axisHelper = new THREE.AxisHelper(250)
        scene.add(axisHelper)

        /* 相机 */
        const width = window.innerWidth // 窗口宽度
        const height = window.innerHeight // 窗口高度
        const k = width / height // 窗口宽高比
        const s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大

        // 创建相机对象
        const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
        camera.position.set(200, 300, 200) // 设置相机位置
        camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

        /* 创建渲染器对象 */
        const renderer = new THREE.WebGLRenderer({
          alpha: true, // canvas是否包含alpha (透明度)。默认为 false
          premultipliedAlpha: false // renderer是否假设颜色有 premultiplied alpha. 默认为true
          // antialias: true // 抗锯齿
        })
        renderer.setSize(width, height) // 设置渲染区域尺寸
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setClearColor(0xb9d3ff, 1) // 设置背景颜色
        document.querySelector('.three').appendChild(renderer.domElement) // body元素中插入canvas对象

        // 执行渲染操作指定场景、相机作为参数
        setTimeout(function () {
          renderer.render(scene, camera)
        }, 100)

        /* 鼠标操作三维场景旋转、缩放 */
        const reRender = () => {
          renderer.render(scene, camera) // 执行渲染操作
        }

        reRender()
        // const controls = new THREE.OrbitControls(camera, renderer.domElement) // 创建控件对象
        const controls = new OrbitControls(camera, renderer.domElement) // 创建控件对象
        controls.addEventListener('change', reRender) // 监听鼠标、键盘事件
      }
    },
    mounted() {
      window.document.title = '纹理贴图加载器TextureLoader'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .container {}
</style>
