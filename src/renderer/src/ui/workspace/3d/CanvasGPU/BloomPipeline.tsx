/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, type ReactNode } from 'react'
// import { rgbeLoader } from './CanvasGPU';
import { useFrame, useThree } from '@react-three/fiber'
import {
  Color,
  DirectionalLight,
  // EquirectangularReflectionMapping,
  Object3D,
  PerspectiveCamera,
  UnsignedByteType
} from 'three'
import { BlendMode, NormalBlending, RenderPipeline, SRGBColorSpace } from 'three/webgpu'
import {
  normalView,
  add,
  directionToColor,
  colorToDirection,
  sample,
  // float,
  // mix,
  // blendColor,
  colorSpaceToWorking,
  roughness,
  metalness,
  vec2
} from 'three/tsl'

import { pass, mrt, output, emissive, vec4 } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'

import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// import { ssr } from "three/addons/tsl/display/SSRNode.js";
// import { traa } from "three/addons/tsl/display/TRAANode.js";
import { fxaa } from 'three/addons/tsl/display/FXAANode.js'
// import { useAppState } from '../World/useAppState';

export function BloomPipeline() {
  const [sun, setSun] = useState<any>(null)
  const scene = useThree((r) => r.scene)
  const camera = useThree((r) => r.camera)
  const renderer = useThree((r) => r.gl)

  useEffect(() => {
    if (!scene) {
      return
    }

    const object: any = new Object3D()

    const dirL = new DirectionalLight(0xffffff, 2)
    dirL.position.set(-20, 10, 10)

    object.sunLight = dirL
    object.sunLight.castShadow = true

    object.add(object.sunLight)
    object.add(object.sunLight.target)

    object.sunLight.castShadow = true
    object.sunLight.shadow.camera.near = 0
    object.sunLight.shadow.camera.far = 150 * 2

    object.sunLight.shadow.camera.left = -5.123 * 8
    object.sunLight.shadow.camera.right = 5.123 * 8
    object.sunLight.shadow.camera.bottom = -5.123 * 8
    object.sunLight.shadow.camera.top = 5.123 * 8

    object.sunLight.shadow.mapSize.width = 1024
    object.sunLight.shadow.mapSize.height = 1024
    object.sunLight.shadow.radius = 1
    object.sunLight.shadow.bias = -0.0005

    const dirR = new DirectionalLight(0xffffff, 2)
    dirR.position.set(20, 10, -10)

    object.moonLight = dirR
    object.moonLight.castShadow = false

    object.add(object.moonLight)
    object.add(object.moonLight.target)

    object.moonLight.castShadow = false
    object.moonLight.shadow.camera.near = 0
    object.moonLight.shadow.camera.far = 150 * 2

    object.moonLight.shadow.camera.left = -5.123 * 8
    object.moonLight.shadow.camera.right = 5.123 * 8
    object.moonLight.shadow.camera.bottom = -5.123 * 8
    object.moonLight.shadow.camera.top = 5.123 * 8

    object.moonLight.shadow.mapSize.width = 1024
    object.moonLight.shadow.mapSize.height = 1024
    object.moonLight.shadow.radius = 1
    object.moonLight.shadow.bias = -0.0005

    //
    object.sunLight.shadow.intensity = 2
    object.sunLight.intensity = 1.5
    object.moonLight.shadow.intensity = 2
    object.moonLight.intensity = 1.5

    setSun(
      <group name="light-player-target">
        <primitive object={object}></primitive>
      </group>
    )

    // set up MRT with emissive

    const mrtNode = mrt({
      output: output,
      emissive: vec4(emissive, output.a)
    })

    mrtNode.setBlendMode('emissive', new BlendMode(NormalBlending))

    const scenePass = pass(scene, camera)
    scenePass.setMRT(mrtNode)

    const colorTexture = scenePass.getTextureNode('output')
    colorTexture.value.type = UnsignedByteType

    const emissivePass = scenePass.getTextureNode('emissive')

    const bloomPass = bloom(emissivePass, 2.5, 1.0, 0.15)

    const aaColor = fxaa(colorTexture.add(bloomPass))

    const outputNode = aaColor

    const pipeline = new RenderPipeline(renderer as any, outputNode)

    const onResize = () => {
      pipeline.needsUpdate = true
      let rect = renderer.domElement.getBoundingClientRect()
      if (rect) {
        ;(camera as PerspectiveCamera).aspect = rect.width / rect.height
        camera.updateProjectionMatrix()
        // renderer.setSize(rect.width, rect.height)
        // renderer.setPixelRatio(window.devicePixelRatio)
      }
    }

    window.addEventListener('resize', onResize)
    let rAFID: any = 0

    let rAF = () => {
      requestAnimationFrame(rAF)
      pipeline.render()
    }
    requestAnimationFrame(rAF)

    return () => {
      window.removeEventListener('resize', onResize)

      cancelAnimationFrame(rAFID)
      object.clear()
    }
  }, [scene])

  //
  useFrame(() => {}, 10000)

  return <>{sun}</>
}
