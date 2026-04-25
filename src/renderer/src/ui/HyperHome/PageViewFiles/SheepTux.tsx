import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import sheep from './robots/tux-transformed.glb?url'
import actmotion from './robots/hi-tux.fbx?url'
import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export function SheepTux() {
  const glb = useGLTF(`${sheep}`)
  const fbx = useFBX(`${actmotion}`)

  glb.scene.scale.setScalar(0)

  const anim = useAnimations(fbx.animations, glb.scene)

  useEffect(() => {
    anim.actions[anim.names[0]]?.play()
    glb.scene.scale.setScalar(1)
  }, [])

  useFrame((st, dt) => {
    anim.mixer.setTime(st.clock.elapsedTime)

    let head = glb.scene.getObjectByName('mixamorigHead')

    if (head) {
      head.rotation.x += 0.2
      head.rotation.y += -0.1
    }

    glb.scene.rotation.x = Math.PI * -0.5
    // glb?.scene?.getObjectByName('mixamorigHead')?.lookAt(2, 0, 0)
  })

  return (
    <>
      <group rotation={[0, 0, 0]} scale={3}>
        <primitive object={glb.scene}></primitive>

        {/* <Gltf castShadow receiveShadow src={sheep}></Gltf> */}
      </group>
    </>
  )
}

//
