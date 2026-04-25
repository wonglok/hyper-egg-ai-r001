import { useFrame, useThree } from '@react-three/fiber'
import { useEnvironment, useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Clock, CubeCamera, Mesh, Scene, Timer, WebGLCubeRenderTarget } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { buildCubeNormal } from './NormalCubeTSL'
import { getDiamondSystem } from './DiamondGo'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

// import dia from '../assets/egg-lowpoly.glb?url'
import dia from '../assets/egg-lowpoly.glb?url'
// import dia from '../assets/egg-lowpoly.glb?url'
// import dia from '../assets/diamond.glb?url'

import { CubeRenderTarget } from 'three/webgpu'
import { rand, uv, vec3, vec4 } from 'three/tsl'
export function DiamondCompos({}) {
  const gl = useThree((r) => r.gl)

  const diamondModel = useGLTF(dia)

  const [dAPI, setDiamond] = useState<any>(null)

  useEffect(() => {
    //
    const cubeCamRtt = new CubeRenderTarget(256, {
      //
    })

    const cubeCam = new CubeCamera(0.1, 500, cubeCamRtt)

    const allDiamonds = clone(diamondModel.scene)
    const obj = allDiamonds.getObjectByName('diam_1')! as Mesh

    obj.geometry = obj.geometry.toNonIndexed()
    obj.geometry.center()
    // obj.geometry.scale(0.02, 0.02, 0.02)
    obj.geometry.computeVertexNormals()

    const normalCubeMap = buildCubeNormal({
      geometry: obj.geometry,
      gl: gl
    }) as any

    const systemForDiamond = getDiamondSystem({
      envMapTex: cubeCamRtt.texture as any,
      normalCubeTex: normalCubeMap
    })

    const material = systemForDiamond.createDiamondMaterial()

    const mesh = new Mesh(obj.geometry, material)
    mesh.add(cubeCam)
    mesh.castShadow = true
    mesh.scale.setScalar(30 * 0.02)

    const scene = new Scene()
    // scene.environment = envMap
    // scene.background = envMap
    const linearYValue = uv().y.mul(0.25).add(0.75)

    scene.environmentNode = vec3(linearYValue)
    scene.backgroundNode = vec4(vec3(linearYValue), 1.0)

    let clock = new Timer()
    const capture = ({}: any) => {
      clock.update(window.performance.now())
      //

      // mesh.getWorldPosition(cubeCam.position)

      // systemForDiamond.uniforms.centreOffset.value.copy(cubeCam.position)

      mesh.visible = false
      cubeCam.visible = false

      cubeCam.update(gl, scene)

      cubeCam.visible = true
      mesh.visible = true
    }

    obj.geometry.computeBoundingSphere()
    systemForDiamond.uniforms.radius.value = obj.geometry.boundingSphere.radius

    setDiamond({
      capture,
      mesh,
      display: <primitive object={mesh}></primitive>
    })

    if (import.meta.env.DEV) {
      const gui = new GUI({ autoPlace: true, container: document.body })
      gui.domElement.style.position = 'fixed'
      gui.domElement.style.top = '10px'
      gui.domElement.style.right = '10px'
      gui.domElement.style.zIndex = '9999'

      // set hidden
      // gui.domElement.style.display = 'none'

      document.body.appendChild(gui.domElement)

      const items = [
        //
        { type: 'number', name: 'mFresnelBias', min: 0, max: 0.5 },
        { type: 'number', name: 'mFresnelScale', min: 0, max: 0.5 },
        { type: 'number', name: 'mFresnelPower', min: 0, max: 2 },
        //
        { type: 'number', name: 'aberration', min: 0, max: 0.5 },
        { type: 'number', name: 'refraction', min: 0, max: 5 },
        //
        { type: 'number', name: 'normalOffset', min: 0, max: 5 },
        { type: 'number', name: 'squashFactor', min: 0, max: 2 },
        { type: 'number', name: 'distanceOffset', min: 0, max: 5 },
        {
          type: 'number',
          name: 'geometryFactor',
          min: 0,
          max: 0.25,
          step: 0.01
        },
        //
        { type: 'color', name: 'absorbption', min: 0, max: 5 },
        { type: 'color', name: 'correction', min: 0, max: 2 },
        { type: 'color', name: 'boost', min: 0, max: 5 },
        //
        { type: 'number', name: 'radius', min: 0, max: 1 },
        { type: 'vec3', name: 'centreOffset', min: -5, max: 5 }
        //
      ]

      items.forEach((it: any) => {
        //

        const op: any = systemForDiamond.uniforms
        if (it.type === 'number') {
          gui.add(
            {
              get [it.name]() {
                return op[it.name].value
              },
              set [it.name](v: any) {
                op[it.name].value = v
              }
            },
            it.name,
            it.min,
            it.max
          )
        }

        if (it.type === 'color') {
          gui.addColor(
            {
              get [it.name]() {
                return '#' + op[it.name].value.getHexString()
              },
              set [it.name](v: any) {
                op[it.name].value.set(v)
              }
            },
            it.name
          )
        }

        if (it.type === 'vec3') {
          gui.add(
            {
              get [it.name]() {
                return op[it.name].value.x
              },
              set [it.name](v: any) {
                op[it.name].value.x = v
              }
            },
            it.name
          )
        }
      })

      gui.close()

      return () => {
        document.body.removeChild(gui.domElement)
        gui.destroy()
      }
    } else {
      return () => {}
    }
  }, [])

  useFrame(({}) => {
    if (dAPI?.mesh) {
      dAPI.mesh.updateMatrixWorld(true)
      dAPI.capture({})
    }
  })

  return (
    <>
      {/*  */}
      {dAPI?.display}
    </>
  )
}

//
//
//
