// import { useEffect, useState } from 'react'
// import { useHome } from './useHome'
// import nprogress from 'nprogress'
import { CanvasGPU } from '../../workspace/3d/CanvasGPU/CanvasGPU'
// import { RoomFX } from '../workspace/3d/RoomFX/RoomFX'
import { Environment, Gltf, OrbitControls, PerspectiveCamera } from '@react-three/drei'
// import { BloomPipeline } from '../workspace/3d/CanvasGPU/BloomPipeline'
import { EnvLoader } from '../../workspace/3d/CanvasGPU/EnvLoader'
// import { toast } from 'sonner'
import hdr from '../../../ui/workspace/3d/assets/factory.hdr?url'
import { PageSelectFolder } from './PageSelectFolder'
import { useHome } from '../useHome'
import { Suspense, useEffect, useMemo } from 'react'
import { SheepRight } from '../PageViewFiles/SheepRight'
// import { CenterMe } from './ProcedureModules/CenterMe'
// import desk from './assets/room/desk-transformed.glb?url'

export function HyperHome({ workspaceName = '' }) {
  //

  useEffect(() => {
    useHome.setState({
      workspace: workspaceName
    })
  }, [workspaceName])

  let workspace = useHome((r) => r.workspace)

  return (
    <>
      <div className=" w-full h-full from-[#cbe9eb] to-[#4391be] bg-linear-120 overflow-hidden">
        {/* <div className="">Welcome Back! {name}</div> */}
        <CanvasGPU>
          <EnvLoader></EnvLoader>
          <Suspense fallback={null}>
            <Environment
              files={[`${hdr}`]}
              backgroundIntensity={0.5}
              environmentIntensity={0.5}
              background
            ></Environment>
          </Suspense>

          <group position={[-2.3, 1.65, -0.1]}>
            <group rotation={[0, Math.PI * -0.25, 0]}>
              <pointLight position={[1, 1, 0]} intensity={2} color={'#fffbc6'}></pointLight>
              <SheepRight></SheepRight>
            </group>
          </group>

          {workspace && <Pages></Pages>}
        </CanvasGPU>
      </div>
    </>
  )
}

function Pages({}) {
  let workspace = useHome((r) => r.workspace)
  let loadFolderConfig = useHome((r) => r.loadFolderConfig)

  useEffect(() => {
    //
    loadFolderConfig({})
    //
  }, [workspace])

  return (
    <>
      <PageSelectFolder workspace={workspace}></PageSelectFolder>
    </>
  )
}
