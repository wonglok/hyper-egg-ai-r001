import { useGLTF } from '@react-three/drei'
import Room from './room/room.glb?url'
import { useMemo, useRef } from 'react'
import {
  BackSide,
  BoxGeometry,
  Color,
  DoubleSide,
  MeshPhysicalNodeMaterial,
  PlaneGeometry,
  SphereGeometry
} from 'three/webgpu'
import {
  add,
  attenuationDistance,
  backgroundBlurriness,
  cameraPosition,
  color,
  cos,
  directionToColor,
  directPointLight,
  dot,
  faceDirection,
  float,
  Fn,
  hue,
  modelNormalMatrix,
  normalFlat,
  normalLocal,
  positionLocal,
  positionWorld,
  sin,
  time,
  uv,
  vec3
} from 'three/tsl'
import { pattern } from './pattern'
// import { polkaDots } from 'tsl-textures'
import { scale } from 'motion/react'
import { ca } from 'zod/v4/locales'
import { useFrame } from '@react-three/fiber'

// import { useFrame } from '@react-three/fiber'
// import { cameraNormalMatrix } from 'three/src/nodes/TSL.js'
// import { EdgeSplitModifier } from 'three/examples/jsm/Addons.js'

// let modifier = new EdgeSplitModifier()
export function RoomFX(props) {
  const ref = useRef<any>(null)
  const geo = useMemo(() => {
    let sph = new SphereGeometry(2, 512, 256, 0, Math.PI, 0, Math.PI)
    sph.rotateY(Math.PI)
    sph.computeVertexNormals()

    return sph
  }, [])

  const mat = useMemo(() => {
    //
    const offset = vec3(
      pattern(positionLocal.zz.mul(5), time).mul(0.2),
      pattern(positionLocal.zz.mul(5), time).mul(0.2),
      pattern(positionLocal.xy.mul(2.5), time).mul(0.2)
    )

    return new MeshPhysicalNodeMaterial({
      //
      colorNode: color('#1dd2d5'), //
      //

      positionNode: Fn(() => {
        return positionLocal.add(offset)
      })(),

      //
      normalNode: normalLocal.normalize().negate(),
      //
      roughnessNode: float(0.5),
      metalnessNode: float(0.5),
      transmission: 1,
      //
      side: DoubleSide

      //
    })
  }, [geo])

  useFrame((_, dt) => {
    if (ref.current && _.camera.position) {
      ref.current.lookAt(_.camera.position.x, _.camera.position.y, _.camera.position.z)
      // console.log(_.camera.position.x, _.camera.position.y, _.camera.position.z)
    }
  })

  return (
    <group ref={ref}>
      <group {...props} dispose={null} position={[0, 0, -5]}>
        <mesh geometry={geo} key={mat.uuid} material={mat} scale={[10, 10, 10]} />
      </group>
    </group>
  )
}
