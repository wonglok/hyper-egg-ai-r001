import { Canvas } from '@react-three/fiber'
import { AuraEffect } from './AuraEffect'

export function AuraExample() {
  return (
    <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 5] }}>
      {/* <color attach="background" args={['#0a0a0a']} /> */}
      <AuraEffect color="#ff1500" intensity={1} speed={1.5} radius={1.5} />
    </Canvas>
  )
}
