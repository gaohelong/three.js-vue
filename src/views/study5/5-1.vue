<template>
  <div class="container">
  </div>
</template>

<script>
  import * as THREE from 'three'
  const OrbitControls = require('three-orbit-controls')(THREE)
  // import { OrbitControls } from 'three/examples/js/controls/OrbitControls.js'

  // let camera, scene, renderer
  // let geometry, material, mesh
  export default {
    name: 'Three1',
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

        /* 基础网格材质MeshBasicMaterial */

        /* 环境光:环境光颜色RGB成分分别和物体材质颜色RGB成分分别相乘 - start */
        // const ambient = new THREE.AmbientLight(0x444444)
        // scene.add(ambient) // 环境光对象添加到scene场景中
        /* 环境光:环境光颜色RGB成分分别和物体材质颜色RGB成分分别相乘 - end */

        /* 点光源 - start */
        // const point = new THREE.PointLight(0xffffff)
        // point.position.set(400, 200, 300) // 设置点光源位置，改变光源的位置
        // scene.add(point)
        /* 点光源 - end */

        /* 平行光 - start */
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        // // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
        // directionalLight.position.set(80, 100, 50)
        // // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0
        // directionalLight.target = mesh
        // scene.add(directionalLight)
        /* 平行光 - end */

        /* 聚光光源 - start */
        // const spotLight = new THREE.SpotLight(0xffffff)
        // // 设置聚光光源位置
        // spotLight.position.set(200, 200, 200)
        // // 聚光灯光源指向网格模型mesh2
        // spotLight.target = mesh
        // // 设置聚光光源发散角度
        // spotLight.angle = Math.PI / 6
        // scene.add(spotLight) // 光对象添加到scene场景中
        /* 聚光光源 - end */

        /* 颜色相乘测试 - start */
        // 网格模型材质设置为白色
        const geometry = new THREE.BoxGeometry(100, 100, 100)
        const material = new THREE.MeshLambertMaterial({
          color: 0xffffff
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        // 环境光   环境光颜色RGB成分分别和物体材质颜色RGB成分分别相乘
        const ambient = new THREE.AmbientLight(0x440000)
        scene.add(ambient) // 环境光对象添加到scene场景中

        // 点光源
        const point = new THREE.PointLight(0xff0000)

        // 设置点光源位置  光源对象和模型对象的position属性一样是Vector3对象
        // PointLight的基类是Light  Light的基类是Object3D  点光源对象继承Object3D对象的位置属性position
        point.position.set(400, 200, 300)
        scene.add(point)
        /* 颜色相乘测试 - end */

        /* 相机设置 */
        const width = window.innerWidth // 窗口宽度
        const height = window.innerHeight // 窗口高度
        const k = width / height // 窗口宽高比
        const s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大

        // 创建相机对象
        const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
        camera.position.set(200, 300, 200) // 设置相机位置
        camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

        // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
        const axisHelper = new THREE.AxisHelper(250)
        scene.add(axisHelper)

        /* 创建渲染器对象 */
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(width, height) // 设置渲染区域尺寸
        renderer.setClearColor(0xb9d3ff, 1) // 设置背景颜色
        document.body.appendChild(renderer.domElement) // body元素中插入canvas对象

        // 执行渲染操作   指定场景、相机作为参数
        renderer.render(scene, camera)

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
      window.document.title = '顶点位置数据解析渲染'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .container {}
</style>
