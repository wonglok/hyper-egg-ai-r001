import { useEnvironment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import hdr from '../assets/factory.hdr?url'

export function RoomLight() {
  const envMap = useEnvironment({ files: [hdr] })
  const scene = useThree((r) => r.scene)

  useEffect(() => {
    //
    // scene.background = envMap
    // scene.environment = envMap
    scene.environmentIntensity = 0.2
    scene.backgroundBlurriness = 0
    scene.backgroundIntensity = 0
    //
  }, [scene])

  return null
}
