import { ReactElement, Suspense, useRef } from 'react'
import { CanvasGPU } from '../CanvasGPU/CanvasGPU'
import { DiamondCompos } from './DiamondComponent'
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Timer } from 'three'
import { RoomFX } from '../RoomFX/RoomFX'
// import { RoomLight } from '../RoomFX/RoomLight'
// import { BloomPipeline } from '../CanvasGPU/BloomPipeline'
import { EnvLoader } from '../CanvasGPU/EnvLoader'
import { SheepTux } from '@renderer/ui/HyperHome/PageViewFiles/SheepTux'
// import { BloomPipeline } from '../CanvasGPU/BloomPipeline'
import hdr from '../assets/factory.hdr?url'
// import factory from '../assets/factory.hdr?url'

export function DiamondCanvas({}) {
  //

  return (
    <>
      <div className="w-full h-full relative">
        <CanvasGPU>
          <OrbitControls
            maxDistance={5}
            minDistance={1.5}
            object-position={[0, 0.0, 1.5]}
            target={[0, 0, 0]}
            makeDefault
          ></OrbitControls>
          <Suspense fallback={null}>
            <RoomFX></RoomFX>
            <EnvLoader></EnvLoader>
          </Suspense>
          <Suspense>
            <group scale={0.5} rotation={[0, 0.25, 0]} position={[0, -0.75, 0]}>
              <SheepTux></SheepTux>
            </group>
            <group scale={0.35} position={[0.35, 0.0, 0.5]}>
              <Spinner speedY={1}>
                <Diamond></Diamond>
              </Spinner>
            </group>

            <Environment files={[`${hdr}`]}></Environment>
          </Suspense>
        </CanvasGPU>
      </div>
    </>
  )
}

function Diamond() {
  //
  return (
    <>
      <group position={[0, 0, 0]}>
        <DiamondCompos></DiamondCompos>
      </group>
    </>
  )
}

export function Spinner({ speedY = 1, children }: { speedY?: number; children?: ReactElement }) {
  let clock = new Timer()
  let ref = useRef<any>(null)
  useFrame((_) => {
    clock.update(performance.now())
    let time = clock.getElapsed()
    let delta = clock.getDelta()
    ref.current.rotation.y += (delta / 5) * speedY
    // ref.current.rotation.x = Math.sin(time * 2) * 0.1
    // ref.current.rotation.z = Math.cos(time * 2) * 0.1
  })

  return (
    <>
      <group ref={ref}>
        {/*  */}
        {children}
      </group>
    </>
  )
}
