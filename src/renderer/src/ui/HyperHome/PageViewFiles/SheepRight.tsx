import { Gltf } from '@react-three/drei'
import sheep from './robots/sheep-right.glb?url'

export function SheepRight() {
  return (
    <>
      <group rotation={[0, 0, 0]} scale={3}>
        <Gltf castShadow receiveShadow src={sheep}></Gltf>
      </group>
    </>
  )
}
