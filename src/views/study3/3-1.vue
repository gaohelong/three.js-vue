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

        /* 点材质PointsMaterial-start */
        // const geometry = new THREE.SphereGeometry(100, 25, 25) // 创建一个球体几何对象
        // const material = new THREE.PointsMaterial({ // 创建一个点材质对象
        //   color: 0x0000ff, // 颜色
        //   size: 3 // 点渲染尺寸
        // })

        // const point = new THREE.Points(geometry, material) // 点模型对象  参数：几何体  点材质
        // scene.add(point) // 网格模型添加到场景中
        /* 点材质PointsMaterial-end */

        /* 线材质-start */
        // const geometry = new THREE.SphereGeometry(100, 25, 25) // 球体
        // const material = new THREE.LineBasicMaterial({ // 直线基础材质对象
        //   color: 0x0000ff
        // })

        // const line = new THREE.Line(geometry, material) // 线模型对象
        // scene.add(line) // 点模型添加到场景中
        /* 线材质-end */

        /* 虚线材质LineDashedMaterial-start */
        // 虚线材质对象：产生虚线效果
        // const geometry = new THREE.SphereGeometry(100, 25, 25) // 球体
        // const material = new THREE.LineDashedMaterial({
        //   color: 0x0000ff,
        //   dashSize: 10, // 显示线段的大小。默认为3。
        //   gapSize: 5 // 间隙的大小。默认为1
        // })
        // const line = new THREE.Line(geometry, material) // 线模型对象
        // line.computeLineDistances() // computeLineDistances方法  计算LineDashedMaterial所需的距离数组
        // scene.add(line) // 点模型添加到场景中
        /* 虚线材质LineDashedMaterial-end */

        /* 基础网格材质MeshBasicMaterial-start */
        // const geometry = new THREE.SphereGeometry(80, 25, 25) // 球体
        // const material = new THREE.MeshBasicMaterial({
        //   color: 0x0000ff
        // })
        // const mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
        // scene.add(mesh) // 网格模型添加到场景中
        /* 基础网格材质MeshBasicMaterial-end */

        /* MeshLambertMaterial材质-start */
        // const geometry = new THREE.SphereGeometry(80, 25, 25) // 球体
        // const material = new THREE.MeshLambertMaterial({
        //   color: 0x00ff00
        // })
        // const mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
        // scene.add(mesh) // 网格模型添加到场景中
        /* MeshLambertMaterial材质-end */

        /* 高光网格材质MeshPhongMaterial-start */
        const geometry = new THREE.SphereGeometry(80, 25, 25) // 球体
        const material = new THREE.MeshPhongMaterial({
          color: 0xff0000,
          specular: 0x444444, // 高光部分的颜色
          shininess: 20 // 高光部分的亮度，默认30
        })
        const mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
        scene.add(mesh) // 网格模型添加到场景中
        /* 高光网格材质MeshPhongMaterial-end */

        // 环境光
        const ambient = new THREE.AmbientLight(0xffffff)
        scene.add(ambient)

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
