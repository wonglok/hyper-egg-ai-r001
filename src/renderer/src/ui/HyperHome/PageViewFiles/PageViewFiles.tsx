import { Box, OrbitControls } from '@react-three/drei'
import { DeskMesh } from '../PageSelectFolder/DeskMesh'
import { DiamondCompos } from '@renderer/ui/workspace/3d/DiamondTSL/DiamondComponent'
import { Spinner } from '@renderer/ui/workspace/3d/DiamondTSL/DiamondCanvas'
// import { useHome } from '../useHome'
import { GeneralButton } from '../PageSelectFolder/GeneralButton'
import { useNavigate } from 'react-router-dom'
// import { Robot } from './Robot'
import { ReactElement, Suspense, useRef } from 'react'
// import { Robot } from './Robot'
// import { Timer } from 'three'
// import { useFrame } from '@react-three/fiber'
import { Sheep } from './Sheep'

export function PageViewFiles({ workspace }: { workspace: string }) {
  console.log('workspace', workspace)

  let navigate = useNavigate()
  //

  return (
    <>
      <OrbitControls
        makeDefault
        object-position={[0, 10, 12]}
        target={[0, 1, 0]}
        minDistance={1.5}
        maxDistance={17}
        minAzimuthAngle={-0.25 * Math.PI}
        maxAzimuthAngle={0.25 * Math.PI}
        maxPolarAngle={0.5 * Math.PI}
        minPolarAngle={0.25 * Math.PI}
      ></OrbitControls>

      <Suspense fallback={null}>
        <DeskMesh></DeskMesh>
      </Suspense>
      {/* <Box></Box> */}

      <group position={[0, 3, -2]}>
        <Suspense fallback={null}>
          <group>
            <group position={[0, -0.4, 0]}>
              <pointLight intensity={2} position={[0, 0, 1.5]} color={'#74ebef'}></pointLight>

              <Sheep></Sheep>
            </group>
          </group>
        </Suspense>
      </group>

      <group position={[-17 / 2, 0, 0]}>
        <group
          onClick={() => {
            navigate(`/workspace/${workspace}/settings`)
          }}
        >
          <group
            //
            position={[0, 1.5, 0]}
            //
            scale={1.5}
          >
            <Spinner>
              <DiamondCompos></DiamondCompos>
            </Spinner>
          </group>

          <group rotation={[-0.23 * Math.PI, 0, 0]} position={[0, 0.5, 1]}>
            <GeneralButton
              title={'Settings'}
              bgNormal={'#fff'}
              bgHover={'#7fd956'}
              textNormal={'#000000'}
              textHover={'#034616'}
              width={3.5}
            ></GeneralButton>
          </group>
        </group>
      </group>

      <group
        onClick={() => {
          //

          console.log('123')

          // window.api.askAI

          const controller = window.api.askAI(
            {
              workspace: workspace,
              route: 'openPath'
            },
            (stream) => {
              //
              const resp = JSON.parse(stream)
              console.log(resp)
            }
          )

          controller.getDataAsync().then((data) => {
            //
          })
          //
        }}
        rotation={[-0.23 * Math.PI, 0, 0]}
        scale={2}
        position={[0, 0.5, 2]}
      >
        <GeneralButton
          title={`Open Folder: ${workspace}`}
          bgNormal={'#fff'}
          bgHover={'#00728c'}
          textNormal={'#000000'}
          textHover={'#ffffff'}
          width={3.5}
        ></GeneralButton>
      </group>

      {/*  */}

      {/*  */}
    </>
  )
}

// function Floating({
//   speedY = 1,
//   children
// }: {
//   speedY?: number
//   children?: ReactElement | ReactElement[]
// }) {
//   let clock = new Timer()
//   let ref = useRef<any>(null)
//   useFrame((_) => {
//     clock.update(performance.now())
//     let time = clock.getElapsed()
//     let delta = clock.getDelta()
//     ref.current.rotation.x = -0.25
//     // ref.current.rotation.y = Math.sin(time) * 0.5 * speedY
//     ref.current.position.y = 0.0 + Math.sin(time * 1) * speedY * 0.5
//     // ref.current.rotation.x = Math.sin(time * 2) * 0.1
//     // ref.current.rotation.z = Math.cos(time * 2) * 0.1
//   })

//   return (
//     <>
//       <group ref={ref}>
//         {/*  */}
//         {children}
//       </group>
//     </>
//   )
// }
