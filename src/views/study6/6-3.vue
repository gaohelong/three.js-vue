<template>
  <div class="container">
  </div>
</template>

<script>
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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

        /* 建立世界坐标系概念 - start */
        const geometry = new THREE.BoxGeometry(20, 20, 20)
        const material = new THREE.MeshLambertMaterial({
          color: 0x0000ff
        })
        const mesh = new THREE.Mesh(geometry, material)
        // mesh的本地坐标设置为(50, 0, 0)
        mesh.position.set(50, 0, 0)
        const group = new THREE.Group()
        // group本地坐标设置和mesh一样设置为(50, 0, 0)
        // mesh父对象设置position会影响得到mesh的世界坐标
        group.position.set(50, 0, 0)
        group.add(mesh)
        scene.add(group)

        // .position属性获得本地坐标
        console.log('本地坐标', mesh.position)

        // getWorldPosition()方法获得世界坐标
        // 该语句默认在threejs渲染的过程中执行,如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
        scene.updateMatrixWorld(true)
        var worldPosition = new THREE.Vector3()
        mesh.getWorldPosition(worldPosition)
        console.log('世界坐标', worldPosition)
        /* 建立世界坐标系概念 - end */

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
      window.document.title = '本地、世界位置坐标'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .container {}
</style>
