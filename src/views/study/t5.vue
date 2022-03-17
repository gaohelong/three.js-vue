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

        /* 创建网格模型 */
        // const geometry = new THREE.SphereGeometry(60, 40, 40) // 创建一个球体几何对象
        const geometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象Geometry
        const material = new THREE.MeshLambertMaterial({ // 材质对象Material
          color: 0x277fbd
        })

        const mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
        scene.add(mesh) // 网格模型添加到场景中

        // 立方体网格模型
        const geometry1 = new THREE.BoxGeometry(100, 100, 100)
        const material1 = new THREE.MeshLambertMaterial({
          color: 0xff0000,
          opacity: 0.7,
          transparent: true
        })
        const mesh1 = new THREE.Mesh(geometry1, material1) // 网格模型对象Mesh
        mesh1.translateX(-120) // 球体网格模型沿X轴反方向平移120
        scene.add(mesh1) // 网格模型添加到场景中

        // 球体网格模型
        const geometry2 = new THREE.SphereGeometry(60, 40, 40)
        const material2 = new THREE.MeshStandardMaterial({
          color: 0x2194ce,
          emissive: 0x0,
          roughness: 0.5,
          metalness: 0.5,
          opacity: 1
        })
        const mesh2 = new THREE.Mesh(geometry2, material2) // 网格模型对象Mesh
        mesh2.translateY(120) // 球体网格模型沿Y轴正方向平移120
        scene.add(mesh2)

        // 圆柱网格模型
        const geometry3 = new THREE.CylinderGeometry(50, 50, 100, 25)
        const material3 = new THREE.MeshPhongMaterial({
          color: 0xffff00
        })
        const mesh3 = new THREE.Mesh(geometry3, material3) // 网格模型对象Mesh
        // mesh3.translateX(120) // 球体网格模型沿Y轴正方向平移120
        mesh3.position.set(120, 0, 0) // 设置mesh3模型对象的xyz坐标为120,0,0
        scene.add(mesh3)

        // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
        const axisHelper = new THREE.AxisHelper(250)
        scene.add(axisHelper)

        /* 光源设置 */
        // 点光源
        const point = new THREE.PointLight(0xffffff)
        point.position.set(400, 200, 300) // 点光源位置
        scene.add(point) // 点光源添加到场景中

        // 点光源2和point关于原点对称
        var point2 = new THREE.PointLight(0xffffff)
        point2.position.set(-400, -200, -300) // 点光源位置
        scene.add(point2) // 点光源添加到场景中

        // 环境光
        const ambient = new THREE.AmbientLight(0x444444)
        scene.add(ambient)
        // console.log(scene)
        // console.log(scene.children)

        /* 相机设置 */
        const width = window.innerWidth // 窗口宽度
        const height = window.innerHeight // 窗口高度
        const k = width / height // 窗口宽高比
        const s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大

        // 创建相机对象
        const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
        camera.position.set(200, 300, 200) // 设置相机位置
        camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

        /* 创建渲染器对象 */
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(width, height) // 设置渲染区域尺寸
        renderer.setClearColor(0xb9d3ff, 1) // 设置背景颜色
        document.body.appendChild(renderer.domElement) // body元素中插入canvas对象

        // 执行渲染操作指定场景、相机作为参数
        // renderer.render(scene, camera)

        /* 执行渲染操作指定场景、相机作为参数->旋转-setInterval */
        setInterval(() => {
          renderer.render(scene, camera) // 执行渲染操作
          mesh.rotateY(0.01) // 每次绕y轴旋转0.01弧度
          mesh1.rotateY(0.01) // 每次绕y轴旋转0.01弧度
          mesh3.rotateY(0.01) // 每次绕y轴旋转0.01弧度
        }, 20)

        /* 执行渲染操作指定场景、相机作为参数->旋转-requestAnimationFrame */
        // let T0 = new Date() // 上次时间
        // const reRender = () => {
        //   const T1 = new Date() // 本次时间
        //   const t = T1 - T0 // 时间差
        //   T0 = T1 // 把本次时间赋值给上次时间
        //   requestAnimationFrame(reRender)
        //   renderer.render(scene, camera) // 执行渲染操作
        //   mesh.rotateY(0.001 * t) // 旋转角速度0.001弧度每毫秒
        // }

        // reRender()

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
      window.document.title = '材质效果'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .container {}
</style>
