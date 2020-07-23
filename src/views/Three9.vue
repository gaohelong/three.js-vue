<template>
  <section class="container">
    <div>图层映射-four</div>
    <div class="three" @click="mousemoveProc"></div>
    <section>
      <button class="btn" @click="reset">回到初始位置</button>
      <button class="btn" @click="freeMove(1)">水平移动</button>
      <button class="btn" @click="freeMove(2)">自由移动</button>
      <button class="btn" @click="freeMove(3)">左右移动30度</button>
      <button class="btn" @click="changeImg(1)">改变图1图片-1</button>
      <button class="btn" @click="changeImg(2)">改变图1图片-2</button>
      <button class="btn" @click="changeImg(3)">改变图1图片-3</button>
    </section>
  </section>
</template>

<script>
  import * as THREE from 'three'
  import img2k from '@/assets/2k_earth_daymap.jpg'
  import aircraftImg from '@/assets/act.jpg'
  import aircraftImg2 from '@/assets/act2.jpg'
  import aircraftImg3 from '@/assets/act3.jpg'
  import pfImg from '@/assets/pf.png'
  // import fgImg from '@/assets/fg.jpg'
  const OrbitControls = require('three-orbit-controls')(THREE)

  let renderer, controls, camera, scene
  let mesh, mesh1
  let requestAnimationFrameVal
  // let angleAzimuthalVal, polarAngleVal
  // let cameraInitialPosition, cameraInitialRotation
  let raycaster, mouse

  let map1, map2, map3

  export default {
    name: 'Three9',
    data() {
      return {
        a: 1
      }
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
      changeImg(num) {
        // console.log(map3)
        // console.log(mesh)

        scene.remove(mesh1) // 移除指定的mesh

        let mp
        switch (num) {
          case 1:
            mp = map1
            break
          case 2:
            mp = map2
            break
          default:
            mp = map3
        }

        const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3)
        planeGeometry.name = 'fly-yibao'
        mesh1 = new THREE.Mesh(planeGeometry, new THREE.MeshLambertMaterial({
          map: mp
        }))

        const positionInfo = this.getPosition(65, 170, 1) // 经度、纬度、z轴
        positionInfo.z = 1 // 和地球贴合
        mesh1.position.copy(positionInfo)
        mesh1.lookAt(0, 0, 0)
        scene.add(mesh1)

        renderer.render(scene, camera)
      },
      mousemoveProc(e) {
        // 将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

        // 新建一个三维单位向量 假设z方向就是0
        // 根据照相机，把这个向量转换到视点坐标系
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(camera)
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
        // camera.position.set(cameraInitialPosition)
        // camera.rotation.set(cameraInitialRotation)
      },
      rotation(type) {
        this.clearAnimationFrame()
        switch (type) {
          case 'x':
            this.rotationX()
            break
          case 'y':
            this.rotationY()
            break
          default:
            this.rotationZ()
        }
      },
      rotationX() {
        mesh.rotateX(0.001) // 每次绕x轴旋转0.01弧度
        requestAnimationFrameVal = window.requestAnimationFrame(this.rotationX) // 请求再次执行渲染函数render
        renderer.render(scene, camera) // 执行渲染操作
      },
      rotationY() {
        mesh.rotateY(0.001) // 每次绕y轴旋转0.01弧度
        requestAnimationFrameVal = window.requestAnimationFrame(this.rotationY) // 请求再次执行渲染函数render
        renderer.render(scene, camera) // 执行渲染操作
      },
      rotationZ() {
        mesh.rotateZ(0.001) // 每次绕z轴旋转0.01弧度
        requestAnimationFrameVal = window.requestAnimationFrame(this.rotationZ) // 请求再次执行渲染函数render
        renderer.render(scene, camera) // 执行渲染操作
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

        /* 灯光 */
        // 环境光会均匀的照亮场景中的所有物体。
        const ambientLight = new THREE.AmbientLight(0xffffff)
        scene.add(ambientLight)

        /* 相机 */
        camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000).translateZ(2.8)
        // cameraInitialPosition = camera.position
        // cameraInitialRotation = camera.rotation
        // console.log(cameraInitialPosition, cameraInitialRotation)
        // camera.filmOffset = 1000 // 水平偏离中心偏移量，和.filmGauge单位相同。默认值为0。
        // camera.screenSpacePanning = false // 定义当平移的时候摄像机的位置将如何移动。如果为true，摄像机将在屏幕空间内平移。 否则，摄像机将在与摄像机向上方向垂直的平面中平移。其默认值为false。
        // 设置摄像机的位置
        // camera.position.x = 3
        // camera.position.y = 3
        // camera.position.z = 3
        // 设置摄像机观察的方向
        // camera.lookAt({
        //   x: 0,
        //   y: 1,
        //   z: 0
        // })

        /* 控制器 */
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false // 启用或禁用摄像机的缩放。
        controls.maxZoom = 1 // 你能够将相机缩小多少
        controls.panSpeed = 1 // 位移的速度，其默认值为1。
        controls.minDistance = 0 // 你能够将相机向内移动多少（仅适用于PerspectiveCamera），其默认值为0。
        controls.maxDistance = 10 // 你能够将相机向外移动多少（仅适用于PerspectiveCamera），其默认值为Infinity。

        // 限制左右旋转角度
        controls.minAzimuthAngle = -Math.PI / 12
        controls.maxAzimuthAngle = Math.PI / 12

        // controls.autoRotate = true // 自动旋转
        // controls.autoRotateSpeed = 0.5 // 旋转速度
        controls.rotateSpeed = 0.2 // 旋转的速度，其默认值为1.
        // angleAzimuthalVal = controls.getAzimuthalAngle() // 获得当前的水平旋转，单位为弧度。
        // polarAngleVal = controls.getPolarAngle() // 获得当前的垂直旋转，单位为弧度。

        // 限制水平移动.
        controls.minPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
        controls.maxPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。

        /* 分组 */
        // const group = new THREE.Group()

        /* 细节 */
        // const lod = new THREE.LOD()

        /* 合并模型，则使用merge方法合并 */
        // const geometry = new THREE.Geometry()

        /* Geometry 是一个便于用户使用的 BufferGeometry 的替代品 */
        // const geometrys = new THREE.Geometry()

        const light = new THREE.PointLight(0xff0000, 1, 100)
        light.position.set(50, 50, 0)
        scene.add(light)

        /* 本地图片、网络获取图片 */
        const loader = new THREE.TextureLoader()

        /* 发光 */
        // const meshFgMap = await loader.load(
        //   fgImg, // 本地图片
        //   // onLoad回调
        //   function (texture) {
        //     return texture
        //   }
        // )
        // const fgMeshBasicMaterial = new THREE.MeshBasicMaterial({
        //   map: meshFgMap
        // })
        // // fgMeshBasicMaterial.transparent = true // 是否透明
        // // fgMeshBasicMaterial.opacity = 1 // 透明度
        // // console.log(fgMeshBasicMaterial.geometry)

        // const meshFg = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 32, 32), fgMeshBasicMaterial)
        // // meshFg.position.z = 0.05
        // scene.add(meshFg)

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
        // lod.addLevel(mesh, 75)
        // mesh.rotation.x = 0
        // mesh.rotation.y = 0
        // mesh.position.z = 0
        // mesh.rotateY(100) // 绕y轴旋转100弧度
        // mesh.lookAt(0, 0, 0)
        // mesh.position.set(0.5, 0.5, 0)
        // group.add(mesh) // 往场景里添加材质.
        scene.add(mesh)
        // geometry.merge(mesh.geometry, mesh.matrix)

        const meshPfMap = await loader.load(
          pfImg, // 本地图片
          // onLoad回调
          function (texture) {
            return texture
          }
        )

        /* 蜂窝图 */
        const fwMeshBasicMaterial = new THREE.MeshBasicMaterial({
          map: meshPfMap
        })
        fwMeshBasicMaterial.transparent = true // 是否透明
        fwMeshBasicMaterial.opacity = 1 // 透明度
        // console.log(fwMeshBasicMaterial.geometry)

        const meshFw = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 32, 32), fwMeshBasicMaterial)
        // lod.addLevel(meshFw, 75)
        // meshFw.rotation.x = 0
        // meshFw.rotation.y = 0
        // meshFw.position.z = 0
        // meshFw.rotateY(200) // 绕y轴旋转100弧度
        // meshFw.lookAt(0, 0, 0)
        // meshFw.position.set(0.5, 0.5, 0)
        // group.add(meshFw) // 往场景里添加材质.
        scene.add(meshFw)

        /* 添加物体 */
        map1 = await loader.load(
          aircraftImg, // 本地图片
          // onLoad回调
          function (texture) {
            return texture
          }
        )

        map2 = await loader.load(
          aircraftImg2, // 本地图片
          // onLoad回调
          function (texture) {
            return texture
          }
        )

        map3 = await loader.load(
          aircraftImg3, // 本地图片
          // onLoad回调
          function (texture) {
            return texture
          }
        )

        // 飞机
        const planeGeometry = new THREE.PlaneBufferGeometry(0.3, 0.3)
        planeGeometry.name = 'fly-yibao'
        mesh1 = new THREE.Mesh(planeGeometry, new THREE.MeshLambertMaterial({
          map: map2
        }))
        // lod.addLevel(mesh1, 150)

        const positionInfo = this.getPosition(65, 170, 1) // 经度、纬度、z轴
        // const positionInfo = {
        //   x: -0.0033133768336965066,
        //   y: 0.010556110602106707,
        //   z: 1 // 和地球贴合
        // }
        positionInfo.z = 1
        // console.log(positionInfo)
        mesh1.position.copy(positionInfo)
        mesh1.rotateZ(18)
        // mesh1.rotation.x = 1
        // mesh1.rotation.y = 1
        // mesh1.rotation.z = 0

        // mesh1.scale.x = 1
        // mesh1.scale.y = 1
        // mesh1.scale.z = 1

        mesh1.lookAt(0, 0, 0)
        // scene.add(mesh1)

        // group.add(mesh1)

        // const material = new THREE.MeshLambertMaterial({
        //   color: 0xf33f66
        // })
        // geometry.merge(mesh1.geometry, mesh1.matrix)
        // const meshs = new THREE.Mesh(geometry, material)
        // meshs.position.z -= 5
        // scene.add(meshs)

        // 飞机2
        const planeGeometry2 = new THREE.PlaneBufferGeometry(0.3, 0.3)
        planeGeometry2.name = 'fly-jiaoyu'
        const mesh2 = new THREE.Mesh(planeGeometry2, new THREE.MeshLambertMaterial({
          map: map1
        }))
        const positionInfo2 = this.getPosition(90, 170, 1) // 经度、纬度、z轴
        positionInfo2.z = 1 // 和地球贴合
        mesh2.position.copy(positionInfo2)
        // console.log(positionInfo2)
        mesh2.lookAt(0, 0, 0)
        // scene.add(mesh2)

        // 飞机3
        const planeGeometry3 = new THREE.PlaneBufferGeometry(0.3, 0.3)
        planeGeometry3.name = 'fly-yiliao'
        const mesh3 = new THREE.Mesh(planeGeometry2, new THREE.MeshLambertMaterial({
          map: map2
        }))
        const positionInfo3 = this.getPosition(115, 170, 1) // 经度、纬度、z轴
        positionInfo3.z = 1 // 和地球贴合
        mesh3.position.copy(positionInfo3)
        // console.log(positionInfo3)
        mesh3.lookAt(0, 0, 0)
        // scene.add(mesh3)

        // 飞机4
        const planeGeometry4 = new THREE.PlaneBufferGeometry(0.3, 0.3)
        planeGeometry4.name = 'fly-shengyu'
        const mesh4 = new THREE.Mesh(planeGeometry4, new THREE.MeshLambertMaterial({
          map: map1
        }))
        const positionInfo4 = this.getPosition(65, 190, 1) // 经度、纬度、z轴
        positionInfo4.z = 1 // 和地球贴合
        mesh4.position.copy(positionInfo4)
        // console.log(positionInfo4)
        mesh4.lookAt(0, 0, 0)
        // scene.add(mesh4)

        // 飞机5
        const planeGeometry5 = new THREE.PlaneBufferGeometry(0.3, 0.3)
        planeGeometry5.name = 'fly-xiuxian'
        const mesh5 = new THREE.Mesh(planeGeometry5, new THREE.MeshLambertMaterial({
          map: map2
        }))
        const positionInfo5 = this.getPosition(90, 190, 1) // 经度、纬度、z轴
        positionInfo5.z = 1 // 和地球贴合
        mesh5.position.copy(positionInfo5)
        // console.log(positionInfo5)
        mesh5.lookAt(0, 0, 0)
        // scene.add(mesh5)

        // 飞机6
        const planeGeometry6 = new THREE.PlaneBufferGeometry(0.3, 0.3)
        planeGeometry6.name = 'fly-dianying'
        const mesh6 = new THREE.Mesh(planeGeometry6, new THREE.MeshLambertMaterial({
          map: map1
        }))
        const positionInfo6 = this.getPosition(115, 190, 1) // 经度、纬度、z轴
        positionInfo6.z = 1 // 和地球贴合
        mesh6.position.copy(positionInfo6)
        // console.log(positionInfo6)
        mesh6.lookAt(0, 0, 0)
        // scene.add(mesh6)

        // scene.add(group)

        /* UV */

        /* 渲染 */
        setTimeout(function () {
          renderer.render(scene, camera)
        }, 1000)
        controls.addEventListener('change', () => {
          renderer.render(scene, camera)
        })
        // invalidation.then(() => (controls.dispose(), renderer.dispose()))

        /* 光线投射 */
        // 这个类用于进行raycasting（光线投射）.光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
        // raycaster = new THREE.Raycaster()
        mouse = new THREE.Vector3()

        // 通过摄像机和鼠标位置更新射线
        // raycaster.setFromCamera(mouse, camera)

        // 计算物体和射线的焦点
        // raycaster.intersectObjects(scene.children)
        // const intersects = raycaster.intersectObjects(scene.children)
        // for (let i = 0; i < intersects.length; i++) {
        //   intersects[i].object.material.color.set(0xff0000)
        // }

        document.querySelector('.three').appendChild(renderer.domElement)
        // document.body.appendChild(renderer.domElement)
      },
      async loadTexture (url) {
        const loader = new THREE.TextureLoader()
        return url => new Promise(resolve => loader.load(url, resolve))
      },
      // 获取position
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
