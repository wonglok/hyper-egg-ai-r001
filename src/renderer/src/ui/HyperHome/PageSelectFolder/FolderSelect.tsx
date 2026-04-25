import { Merged, useGLTF } from '@react-three/drei'
import { InstanceProps, useFrame, useGraph } from '@react-three/fiber'
import { FC, ReactNode, useMemo, useRef } from 'react'
import { Color, ColorRepresentation, DoubleSide, MathUtils, Mesh } from 'three'
import { MeshPhysicalNodeMaterial } from 'three/webgpu'
import folder from './smart-folder.glb?url'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js'
import { CenterMe } from './CenterMe'
// import { helvetica } from './helvetica'

export function FolderSelect({}) {
  const refHover = useRef(0)
  const glb = useGLTF(`${folder}`)
  const { nodes }: { nodes: Record<string, Mesh> & any } = useGraph(glb.scene)

  let box = useMemo(() => {
    let geo = new RoundedBoxGeometry(1, 1.5, 0.5, 7, 0.5)

    geo.translate(0, 2, 0)
    geo.scale(1, 1, 0.1)

    let mat = new MeshPhysicalNodeMaterial({
      //
      roughness: 0,
      metalness: 0,
      color: '#ffffff',
      vertexColors: true,
      side: DoubleSide,
      transmission: 1
    })

    let box = new Mesh(geo, mat)

    return box
  }, [])

  let mat = useMemo(() => {
    return new MeshPhysicalNodeMaterial({
      roughness: 0,
      metalness: 0,
      color: '#f7cb3c',
      emissive: '#b09129',
      vertexColors: true,
      side: DoubleSide
    })
  }, [])

  return (
    <>
      <CenterMe>
        <group
          rotation={[-0.53, 0, 0]}
          onPointerEnter={() => {
            refHover.current = 1
          }}
          onPointerLeave={() => {
            refHover.current = 0
          }}
        >
          <Merged
            onLostPointerCapture={(ev) => {
              ev.stopPropagation()
            }}
            meshes={{
              ['folder-front']: new Mesh(nodes['folder-front'].geometry, mat),
              ['folder-back']: new Mesh(nodes['folder-back'].geometry, mat),
              ['box']: box
            }}
          >
            {(instances) => {
              let Back = instances['folder-back']
              let Front = instances['folder-front']
              let Box = instances['box']

              let files = []
              for (let i = -5; i < 5; i++) {
                files.push(
                  <EachPlane
                    hover={refHover}
                    Compo={Box}
                    key={'plane' + i}
                    n={11}
                    i={i}
                  ></EachPlane>
                )
              }

              return (
                <>
                  <Front></Front>
                  <Back></Back>

                  {files}
                </>
              )
            }}
          </Merged>
        </group>
      </CenterMe>
    </>
  )
}

function EachPlane({
  i,
  n,
  hover,
  Compo
}: {
  i: number
  n: number
  hover: { current: number }
  Compo: FC<
    InstanceProps & { ref: any } & {
      rotation: number[]
      position: number[]
      color: ColorRepresentation
    }
  > &
    ReactNode &
    any
}) {
  let ref = useRef<any>(null)
  let refFade = useRef<any>(0)

  useFrame((_, dt) => {
    refFade.current = MathUtils.lerp(refFade.current, hover.current, 0.1)

    ref.current.position.y =
      Math.sin(_.clock.elapsedTime * 1.5 + (i / n) * Math.PI * -2 * 0.5) * 0.2

    ref.current.position.x = i * (-0.15 + -0.05 * Math.cos(_.clock.elapsedTime * 1.5)) * 0.15

    ref.current.rotation.z = Math.PI * 0.05 * i + refFade.current * 0.025 * i * Math.PI
  })

  return (
    <Compo
      ref={ref}
      rotation={[0.1 + i * 0.035, 0, Math.PI * 0.05 * i]}
      position={[i * -0.05, -0.3, i * 0.075 * 0.0]}
      color={new Color('#ff0000').offsetHSL(i / n, 0.0, 0.15)}
    />
  )
}
