<template>
  <section class="container">
    <div>Glft-水平-物体替换-改变物体颜色</div>
    <div class="three" @click="clickProc"></div>
    <section>
      <button class="btn" @click="reset">回到初始位置</button>
      <button class="btn" @click="freeMove(1)">水平移动</button>
      <button class="btn" @click="freeMove(2)">自由移动</button>
    </section>
  </section>
</template>

<script>
  import img2k from '@/assets/2k_earth_daymap.jpg'
  import * as THREE from 'three'
  // import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

  let renderer, controls, camera, scene
  let mesh
  let requestAnimationFrameVal
  let raycaster
  let qiuGroup
  const groupArr = []
  const mouse = new THREE.Vector2()

  export default {
    name: 'Three12',
    data() {
      return {}
    },
    methods: {
      freeMove(type) {
        this.clearAnimationFrame()

        controls.minAzimuthAngle = -Infinity
        controls.maxAzimuthAngle = Infinity

        switch (type) {
          case 1: // 限制水平移动.
            controls.minPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
            controls.maxPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。
            break
          case 2: // 自由移动.
            controls.minPolarAngle = 0 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
            controls.maxPolarAngle = Math.PI // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。
            break
          default:
            // 限制水平移动.
            controls.minPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
            controls.maxPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。

            // 限制左右旋转角度
            controls.minAzimuthAngle = -Math.PI / 12
            controls.maxAzimuthAngle = Math.PI / 12
        }

        controls.reset()
      },
      clickProc(e) {
        console.clear()
        // event.preventDefault()
        console.log('e.clientX:' + e.clientX)
        console.log('e.clientY:' + e.clientY)

        // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
        console.log('mouse-v2:', mouse)

        // 新建一个三维单位向量 假设z方向就是0, 根据照相机，把这个向量转换到视点坐标系
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(camera)
        // console.log(camera.position, vector.sub(camera.position).normalize())

        // 在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
        raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())

        // 用一个新的原点和方向向量来更新射线（ray），用照相机的原点和点击的点构成一条直线。Vector2
        raycaster.setFromCamera(mouse, camera)

        // console.log('mouse-v3:', vector)
        // console.log(qiuGroup.children)

        // 获取与raycaster射线相交的数组集合，其中的元素按照距离排序，越近的越靠前
        const intersects = raycaster.intersectObjects(qiuGroup.children, true) // 遍历子元素

        console.log(intersects)
        if (intersects.length > 0) {
          let seled = {}
          intersects.forEach((v, i) => {
            if (i === 0) {
              seled = v.object
            }
            console.log(`${i}: ${v.object.name}`)
          })

          // 替换
          const material = new THREE.MeshLambertMaterial({
            color: 0xffffff * Math.random(),
            transparent: false,
            opacity: 0.8
          })
          seled.material = material
          console.log(seled)
          renderer.render(scene, camera)
        }

        // 返回选中的对象数组
        // return intersects
      },
      mousemoveProc(e) {
        // 将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

        // 新建一个三维单位向量 假设z方向就是0
        // 根据照相机，把这个向量转换到视点坐标系
        const vector = new THREE.Vector3(mouse.x, mouse.y, 2.8).unproject(camera)
        console.log(vector)

        // 在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
        raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())

        // 射线和模型求交，选中一系列直线
        const intersects = raycaster.intersectObjects(scene.children)
        // console.log('imtersrcts=' + intersects)

        if (intersects.length > 0) {
          // 选中第一个射线相交的物体
          // SELECTED = intersects[0].object
          // const intersected = intersects[0].object
          console.log(intersects[0].object)
          // console.log(intersects[0].object.geometry)
          // console.log(intersects[0].object.geometry.type)
          if (intersects[0].object.geometry && intersects[0].object.geometry.type === 'PlaneBufferGeometry') {
            console.log(intersects[0].object.geometry.name)
          }
        }
      },
      reset() {
        this.clearAnimationFrame()
        controls.reset()
      },
      clearAnimationFrame() {
        window.cancelAnimationFrame(requestAnimationFrameVal)
      },
      async init () {
        /* 初始化渲染实例及设置 */
        renderer = new THREE.WebGLRenderer({
          alpha: true, // canvas是否包含alpha (透明度)。默认为 false
          premultipliedAlpha: false // renderer是否假设颜色有 premultiplied alpha. 默认为true
          // antialias: true // 抗锯齿
        })
        const size = Math.min(window.innerWidth, 600)
        renderer.setSize(size, size)
        renderer.setPixelRatio(window.devicePixelRatio)
        // renderer.shadowMap.enabled = true // 设置是否开启投影, 开启的话, 光照会产生投影
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap // 设置投影类型, 这边的柔和投影

        /* 场景 */
        scene = new THREE.Scene()

        /* 分组 */
        qiuGroup = new THREE.Group()

        /* 声明 raycaster 和 mouse */
        raycaster = new THREE.Raycaster()

        /* 相机 */
        camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
        // camera.translateX(0)
        // camera.translateY(0)
        camera.translateZ(2.8) // 摄像机距离物体远、近
        // raycaster.setFromCamera(mouse, camera)

        /* 控制器 */
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false // 启用或禁用摄像机的缩放。
        controls.maxZoom = 1 // 你能够将相机缩小多少
        controls.panSpeed = 1 // 位移的速度，其默认值为1。
        controls.minDistance = 0 // 你能够将相机向内移动多少（仅适用于PerspectiveCamera），其默认值为0。
        controls.maxDistance = 10 // 你能够将相机向外移动多少（仅适用于PerspectiveCamera），其默认值为Infinity。

        // 限制左右旋转角度
        // controls.minAzimuthAngle = -Math.PI / 12
        // controls.maxAzimuthAngle = Math.PI / 12

        // controls.autoRotate = true // 自动旋转
        // controls.autoRotateSpeed = 0.5 // 旋转速度
        controls.rotateSpeed = 0.2 // 旋转的速度，其默认值为1.
        // angleAzimuthalVal = controls.getAzimuthalAngle() // 获得当前的水平旋转，单位为弧度。
        // polarAngleVal = controls.getPolarAngle() // 获得当前的垂直旋转，单位为弧度。

        // 限制水平移动.
        controls.minPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
        controls.maxPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。

        /* 灯光 */
        // const light = new THREE.PointLight(0xff0000, 1, 100)
        // light.position.set(50, 50, 0)
        // scene.add(light)

        /* 灯光 */
        // 环境光会均匀的照亮场景中的所有物体。
        // const ambientLight = new THREE.AmbientLight(0xffffff)
        // scene.add(ambientLight)

        /* 灯光 */
        const spotLight = new THREE.SpotLight(0xffffff)
        spotLight.position.set(10000, 10000, 10000)
        spotLight.castShadow = true
        spotLight.shadow.mapSize.width = 1024
        spotLight.shadow.mapSize.height = 1024
        spotLight.shadow.camera.near = 1
        spotLight.shadow.camera.far = 4000
        spotLight.shadow.camera.fov = 1000
        scene.add(spotLight)

        /* 灯光 */
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        // scene.add(directionalLight)

        /* 用于简单模拟3个坐标轴的对象. 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴. */
        const axesHelper = new THREE.AxesHelper(5)
        scene.add(axesHelper)

        /* 坐标格辅助对象. 坐标格实际上是2维线数组. */
        const gridHelper = new THREE.GridHelper(10, 10, 0x040404, 0x123456)
        scene.add(gridHelper)

        /* 用于图形化地展示对象世界轴心对齐的包围盒的辅助对象。 */
        const sphere = new THREE.SphereBufferGeometry()
        const object = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial(0xff0000))
        const box = new THREE.BoxHelper(object, 0xffff00)
        scene.add(box)

        /* 用于模拟相机视锥体的辅助对象. */
        const cameraHelper = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const helper = new THREE.CameraHelper(cameraHelper)
        scene.add(helper)

        /* 创建一个虚拟的球形网格 Mesh 的辅助对象来模拟 点光源 PointLight. */
        // const pointLight = new THREE.PointLight(0xff0000, 1, 100)
        // pointLight.position.set(10, 10, 10)
        // scene.add(pointLight)

        // const sphereSize = 1
        // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize)
        // scene.add(pointLightHelper)

        /* 本地图片、网络获取图片 */
        const loader = new THREE.TextureLoader()

        /* 地球材质 */
        const map = await loader.load(
          // 资源URL
          // 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg', // 网络获取图片
          img2k, // 本地图片
          // onLoad回调
          function (texture) {
            return texture
          },
          undefined,
          // onError回调
          function (error) {
            console.error('An error happened.', error)
          }
        )

        const dqMeshBasicMaterial = new THREE.MeshBasicMaterial({
          map
        })
        dqMeshBasicMaterial.transparent = true // 是否透明
        dqMeshBasicMaterial.opacity = 1 // 透明度
        mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 32, 32), dqMeshBasicMaterial)
        // scene.add(mesh)

        /* 渲染 */
        setTimeout(function () {
          renderer.render(scene, camera)
        }, 1000)
        controls.addEventListener('change', () => {
          renderer.render(scene, camera)
        })
        document.querySelector('.three').appendChild(renderer.domElement)
        // document.addEventListener('click', this.clickProc, false)
      },
      loadGltf() {
        /* 加载gltf */
        const loader = new GLTFLoader()
        // console.log(loader)
        // loader.load('https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf', function (gltf) {
        //   scene.add(gltf.scene)
        // }, undefined, function (error) {
        //   console.error(error)
        // })
        // const self = this
        loader.load(
          '/3dm/qiuliubian.gltf',
          // 'https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf',
          (gltf) => {
            // console.log(gltf)
            gltf.scene.traverse(function (child) {
              // console.log(child)
              if (child.isMesh) {
                // console.log(qiuGroup)
                // console.log(child)
                groupArr.push(child)
                // console.log(groupArr)
                // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                // roughnessMipmapper.generateMipmaps( child.material )
                // self.addGroup(child)
              }
            })

            // 遍历添加
            groupArr.map(v => {
              qiuGroup.add(v)
            })

            // called when the resource is loaded
            // scene.add(gltf.scene)
            // qiuGroup.position.copy(this.getPosition(180, 180, 1))
            scene.add(qiuGroup)
          },
          (xhr) => {
            // called while loading is progressing
            // console.log(xhr.loaded)
            // console.log(xhr.total * 100)
            const p = xhr.loaded / xhr.total * 100
            console.log(`${p}% loaded`)
            // console.log(groupArr)
          },
          (error) => {
            // called when loading has errors
            console.error('An error happened', error)
          }
        )
        // 包含材质
        // new MTLLoader().setPath('/static/3dm/VANS/').load('VANS.mtl', materials => {
        //   // console.log("materials", materials)
        //   materials.preload()
        //   new OBJLoader().setMaterials(materials).setPath('/static/3dm/VANS/').load('VANS.obj', obj => {
        //     obj.scale.set(0.8, 0.8, 0.8)
        //     obj.position.set(-40, -50, 10)
        //     scene.add(obj)
        //   })
        // })
      },
      async loadTexture (url) {
        const loader = new THREE.TextureLoader()
        return url => new Promise(resolve => loader.load(url, resolve))
      },
      // 获取position, longitude, latitude, alt即经度、纬度、高度。
      getPosition(lng, lat, alt) {
        var phi = (90 - lat) * (Math.PI / 180)
        var theta = (lng + 180) * (Math.PI / 180)
        var radius = alt + 0.01
        var x = -(radius * Math.sin(phi) * Math.cos(theta))
        var z = (radius * Math.sin(phi) * Math.sin(theta))
        var y = (radius * Math.cos(phi))
        return {
          x: x,
          y: y,
          z: z
        }
      },
      animation() {
        mesh.rotateY(0.003) // 每次绕y轴旋转0.01弧度 - 绕局部空间的Y轴旋转这个物体, 将要旋转的角度（以弧度来表示）
        requestAnimationFrameVal = window.requestAnimationFrame(this.animation) // 请求再次执行渲染函数render
        renderer.render(scene, camera) // 执行渲染操作
      }
    },
    async mounted () {
      await this.init()
      this.loadGltf()
      // this.animation()
    },
    beforeDestroy() {
      controls.dispose()
      renderer.dispose()
      window.cancelAnimationFrame(requestAnimationFrameVal)
    }
  }
</script>

<style lang="less" scoped>
  .list {
    .item {
      line-height: 36px;
      font-size: 16px;
      text-align: left;
      border-bottom: 1px solid #ccc;
    }
  }

  .btn {
    display: block;
    line-height: 40px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 0.5rem;
    font-size: 16px;
    letter-spacing: 2px;
    outline: none;
    cursor: pointer;
    background-color: #1f3b74;
    color: #ffffff;
  }
</style>
