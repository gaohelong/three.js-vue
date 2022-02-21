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

        /* 图片加载器 */
        const ImageLoader = new THREE.ImageLoader()

        // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
        ImageLoader.load(
          imgPf,
          function (img) {
            // image对象作为参数，创建一个纹理对象Texture
            const texture = new THREE.Texture(img)
            // 下次使用纹理时触发更新
            texture.needsUpdate = true

            // 该材质使用基于非物理的Lambertian模型来计算反射率。 这可以很好地模拟一些表面（例如未经处理的木材或石材），但不能模拟具有镜面高光的光泽表面（例如涂漆木材）。
            // const material = new THREE.MeshLambertMaterial({ //
            //   map: texture // 设置纹理贴图
            // })

            const material = new THREE.MeshBasicMaterial({ // 这种材质不受光照的影, 图片本色
              map: texture // 设置纹理贴图
            })

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
      window.document.title = '纹理对象Texture'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .container {}
</style>
