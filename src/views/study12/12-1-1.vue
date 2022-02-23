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
    name: 'Three12-1-1',
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

        /* 创建骨骼网格模型SkinnedMesh */
        // 创建一个圆柱几何体，高度120，顶点坐标y分量范围[-60,60]
        const geometry = new THREE.CylinderGeometry(5, 10, 120, 50, 300)
        geometry.translate(0, 60, 0) // 平移后，y分量范围[0,120]
        console.log('name', geometry.vertices) // 控制台查看顶点坐标

        /* 设置几何体对象Geometry的蒙皮索引skinIndices、权重skinWeights属性. 实现一个模拟腿部骨骼运动的效果 */
        // 遍历几何体顶点，为每一个顶点设置蒙皮索引、权重属性
        // 根据y来分段，0~60一段、60~100一段、100~120一段
        for (let i = 0; i < geometry.vertices.length; i++) {
          const vertex = geometry.vertices[i] // 第i个顶点
          if (vertex.y <= 60) {
            // 设置每个顶点蒙皮索引属性  受根关节Bone1影响
            geometry.skinIndices.push(new THREE.Vector4(0, 0, 0, 0))

            // 设置每个顶点蒙皮权重属性
            // 影响该顶点关节Bone1对应权重是1-vertex.y/60
            geometry.skinWeights.push(new THREE.Vector4(1 - vertex.y / 60, 0, 0, 0))
          } else if (vertex.y > 60 && vertex.y <= 60 + 40) {
            // Vector4(1, 0, 0, 0)表示对应顶点受关节Bone2影响
            geometry.skinIndices.push(new THREE.Vector4(1, 0, 0, 0))
            // 影响该顶点关节Bone2对应权重是1-(vertex.y-60)/40
            geometry.skinWeights.push(new THREE.Vector4(1 - (vertex.y - 60) / 40, 0, 0, 0))
          } else if (60 + 40 < vertex.y && vertex.y <= 60 + 40 + 20) {
            // Vector4(2, 0, 0, 0)表示对应顶点受关节Bone3影响
            geometry.skinIndices.push(new THREE.Vector4(2, 0, 0, 0))
            // 影响该顶点关节Bone3对应权重是1-(vertex.y-100)/20
            geometry.skinWeights.push(new THREE.Vector4(1 - (vertex.y - 100) / 20, 0, 0, 0))
          }
        }

        // 材质对象
        const material = new THREE.MeshPhongMaterial({
          skinning: true // 允许蒙皮动画
          // wireframe:true,
        })

        // 创建骨骼网格模型
        const SkinnedMesh = new THREE.SkinnedMesh(geometry, material)
        SkinnedMesh.position.set(50, 120, 50) // 设置网格模型位置
        SkinnedMesh.rotateX(Math.PI) // 旋转网格模型
        scene.add(SkinnedMesh) // 网格模型添加到场景中

        /* 骨骼系统 */
        const Bone1 = new THREE.Bone() // 关节1，用来作为根关节
        const Bone2 = new THREE.Bone() // 关节2
        const Bone3 = new THREE.Bone() // 关节3

        // 设置关节父子关系 多个骨头关节构成一个树结构
        Bone1.add(Bone2)
        Bone2.add(Bone3)

        // 设置关节之间的相对位置
        // 根关节Bone1默认位置是(0,0,0)
        Bone2.position.y = 60 // Bone2相对父对象Bone1位置
        Bone3.position.y = 40 // Bone3相对父对象Bone2位置

        // 所有Bone对象插入到Skeleton中，全部设置为.bones属性的元素
        const skeleton = new THREE.Skeleton([Bone1, Bone2, Bone3]) // 创建骨骼系统
        // console.log(skeleton.bones);
        // 返回所有关节的世界坐标
        // skeleton.bones.forEach(elem => {
        //   console.log(elem.getWorldPosition(new THREE.Vector3()));
        // });
        // 骨骼关联网格模型
        SkinnedMesh.add(Bone1) // 根骨头关节添加到网格模型
        SkinnedMesh.bind(skeleton) // 网格模型绑定到骨骼系统
        console.log(SkinnedMesh)

        /* 骨骼辅助显示 */
        const skeletonHelper = new THREE.SkeletonHelper(SkinnedMesh)
        scene.add(skeletonHelper)

        // 转动关节带动骨骼网格模型出现弯曲效果, 好像腿弯曲一样
        skeleton.bones[1].rotation.x = 0.5
        skeleton.bones[2].rotation.x = 0.5

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
        let n = 0
        const T = 50
        const step = 0.01
        const reRender = () => {
          renderer.render(scene, camera) // 执行渲染操作
          requestAnimationFrame(reRender)
          n += 1
          if (n < T) {
            // 改变骨关节角度
            skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x - step
            skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x + step
            skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x + 2 * step
          }

          if (n < 2 * T && n > T) {
            skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x + step
            skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x - step
            skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x - 2 * step
          }

          if (n === 2 * T) {
            n = 0
          }
        }

        reRender()
        // const controls = new THREE.OrbitControls(camera, renderer.domElement) // 创建控件对象
        const controls = new OrbitControls(camera, renderer.domElement) // 创建控件对象
        controls.addEventListener('change', reRender) // 监听鼠标、键盘事件
      }
    },
    mounted() {
      window.document.title = '骨骼动画(SkinnedMesh)'
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .container {}
</style>
