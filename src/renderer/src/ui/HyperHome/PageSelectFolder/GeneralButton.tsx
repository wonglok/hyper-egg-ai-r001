import { Center, Merged, Text3D, useGLTF } from '@react-three/drei'
// import { extend, InstanceProps, useFrame, useGraph } from '@react-three/fiber'
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
// import { Color, ColorRepresentation, DoubleSide, Mesh, Object3D } from 'three'
// import { MeshPhysicalNodeMaterial } from 'three/webgpu'
// import folder from '../assets/smart-folder.glb?url'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js'
import { helvetica } from './fonts/helvetica'
import { CenterMe } from './CenterMe'

import gsap from 'gsap'
import { Color } from 'three'

export const GeneralButton = ({
  title = 'Select AI Folder',
  bgNormal = '#fff',
  bgHover = '#5688d9',
  textNormal = '#000000',
  textHover = '#040346',
  width = 6.5
}) => {
  const baseMat = useRef<any>(null)
  const textMat = useRef<any>(null)

  const roundedGeo = useMemo(
    () => new RoundedBoxGeometry(Math.max(width, title.length / 3 + 2), 1, 1, 7, 1 / 4),
    [width, title]
  )

  const bgNormalColor = useMemo(() => new Color(bgNormal), [bgNormal])
  const bgHoverColor = useMemo(() => new Color(bgHover), [bgHover])

  const textNormalColor = useMemo(() => new Color(textNormal), [textNormal])
  const textHoverColor = useMemo(() => new Color(textHover), [textHover])

  return (
    <>
      <group
        onPointerEnter={() => {
          const progress = { value: 0 }
          const bgCol = new Color().set(baseMat?.current?.color)
          const texCol = new Color().set(textMat?.current?.color)

          gsap
            .to(progress, {
              value: 1,
              duration: 0.5,
              ease: 'expo.inOut',
              onUpdate: () => {
                bgCol.lerpHSL(bgHoverColor, progress.value)
                texCol.lerpHSL(textHoverColor, progress.value)
                if (baseMat.current) {
                  baseMat.current.color.copy(bgCol)
                }

                if (textMat.current) {
                  textMat.current.color.copy(texCol)
                }
              }
            })
            .play()
        }}
        onPointerLeave={() => {
          const progress = { value: 0 }
          const bgCol = new Color().set(baseMat?.current?.color)
          const texCol = new Color().set(textMat?.current?.color)

          gsap
            .to(progress, {
              value: 1,
              duration: 0.5,
              ease: 'expo.inOut',
              onUpdate: () => {
                bgCol.lerpHSL(bgNormalColor, progress.value)
                texCol.lerpHSL(textNormalColor, progress.value)
                if (baseMat.current) {
                  baseMat.current.color.copy(bgCol)
                }
                if (textMat.current) {
                  textMat.current.color.copy(texCol)
                }
              }
            })
            .play()
        }}
      >
        <group scale={0.5}>
          <group position={[0, 0, -0.05]}>
            <CenterMe>
              <mesh geometry={roundedGeo} scale={[1, 1, 0.1]}>
                <meshPhysicalMaterial
                  color={bgNormalColor}
                  roughness={0.2}
                  metalness={0.0}
                  transmission={1}
                  ref={baseMat}
                ></meshPhysicalMaterial>
              </mesh>
            </CenterMe>
          </group>

          <CenterMe key={title}>
            <Text3D size={0.5} height={0.05} font={helvetica as any}>
              {`${title}`}
              <meshStandardMaterial
                color={textNormalColor}
                metalness={0.2}
                roughness={1}
                ref={textMat}
              ></meshStandardMaterial>
            </Text3D>
          </CenterMe>
        </group>
      </group>
    </>
  )
}
