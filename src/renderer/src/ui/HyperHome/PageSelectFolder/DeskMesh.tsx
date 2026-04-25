import { useMemo } from 'react'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js'
import {
  DoubleSide,
  Mesh,
  MeshPhysicalNodeMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3
} from 'three/webgpu'
import normalGL from './Chip005_4K-PNG_NormalGL.png?url'
import { useTexture } from '@react-three/drei'

export function DeskMesh() {
  const normalMap = useTexture(normalGL)
  let box = useMemo(() => {
    let geo = new RoundedBoxGeometry(25, 15, 12.5, 5, 5)
    geo.computeBoundingBox()

    let v3 = new Vector3()
    geo.boundingBox.getSize(v3)
    geo.translate(0, 0, -v3.z / 4)
    geo.scale(1, 1 / 50, 1)

    normalMap.repeat.set(1, 0.5).multiplyScalar(2)

    normalMap.wrapS = normalMap.wrapT = RepeatWrapping

    let mat = new MeshPhysicalNodeMaterial({
      //
      normalMap: normalMap,
      roughness: 0.2,
      metalness: 0.8,
      color: '#f3c78d',
      vertexColors: true,
      side: DoubleSide,
      transmission: 0.7
    })

    let box = new Mesh(geo, mat)

    return box
  }, [])

  return (
    <>
      <primitive object={box}></primitive>
    </>
  )
}
