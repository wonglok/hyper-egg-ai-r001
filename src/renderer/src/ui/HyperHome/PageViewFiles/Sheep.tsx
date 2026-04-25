import { Gltf } from '@react-three/drei'
import sheep from './robots/sheep.glb?url'

export function Sheep() {
  return (
    <>
      <group rotation={[0, Math.PI * -0.5, 0]} scale={5}>
        <Gltf castShadow receiveShadow src={sheep}></Gltf>
      </group>
    </>
  )
}
