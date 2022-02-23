<template>
  <div class="container">
    <div class="three"></div>
  </div>
</template>

<script>
  import * as THREE from 'three'
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

        const geometry1 = new THREE.BoxGeometry(20, 20, 20) // 立方体
        const geometry2 = new THREE.SphereGeometry(30, 25, 25) // 球体

        const material1 = new THREE.MeshBasicMaterial({ // 材质对象Material
          color: 0x241ab5
        })
        const mesh1 = new THREE.Mesh(geometry1, material1) // 网格模型对象Mesh

        const material2 = new THREE.MeshBasicMaterial({ // 材质对象Material
          color: 0x1ab52e
        })
        const mesh2 = new THREE.Mesh(geometry2, material2) // 网格模型对象Mesh

        /* 创建两个网格模型并设置一个父对象group */
        mesh1.name = 'Box' // 网格模型1命名
        mesh2.name = 'Sphere' // 网格模型2命名
        const group = new THREE.Group()
        group.add(mesh1) // 网格模型添加到组中
        group.add(mesh2) // 网格模型添加到组中
        scene.add(group) // 把group插入到场景中作为场景子对象

        /* 编辑group子对象网格模型mesh1和mesh2的帧动画数据 */
        // 创建名为Box对象的关键帧数据
        const times = [0, 10] // 关键帧时间数组，离散的时间点序列
        const values = [0, 0, 0, 150, 0, 0] // 与时间点对应的值组成的数组

        // 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
        const posTrack = new THREE.KeyframeTrack('Box.position', times, values)

        // 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
        const colorKF = new THREE.KeyframeTrack('Box.material.color', [10, 20], [1, 0, 0, 0, 0, 1])

        // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
        const scaleTrack = new THREE.KeyframeTrack('Sphere.scale', [0, 20], [1, 1, 1, 3, 3, 3])

        // duration决定了默认的播放时间，一般取所有帧动画的最大时间
        // duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
        const duration = 20

        // 多个帧动画作为元素创建一个剪辑clip对象，命名default，持续时间20
        const clip = new THREE.AnimationClip('default', duration, [posTrack, colorKF, scaleTrack])

        /* 播放编辑好的关键帧数据 */
        // group作为混合器的参数，可以播放group中所有子对象的帧动画
        const mixer = new THREE.AnimationMixer(group)

        // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
        const AnimationAction = mixer.clipAction(clip)

        // 通过操作Action设置播放方式
        AnimationAction.timeScale = 20 // 默认1，可以调节播放速度

        // AnimationAction.loop = THREE.LoopOnce; // 不循环播放
        AnimationAction.play() // 开始播放

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
        const clock = new THREE.Clock()
        const reRender = () => {
          renderer.render(scene, camera) // 执行渲染操作
          requestAnimationFrame(reRender) // 请求再次执行渲染函数render，渲染下一帧

          // clock.getDelta()方法获得两帧的时间间隔
          // 更新混合器相关的时间
          mixer.update(clock.getDelta())
        }

        reRender()
        // const controls = new THREE.OrbitControls(camera, renderer.domElement) // 创建控件对象
        const controls = new OrbitControls(camera, renderer.domElement) // 创建控件对象
        controls.addEventListener('change', reRender) // 监听鼠标、键盘事件
      }
    },
    mounted() {
      window.document.title = '动画'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .container {}
</style>
