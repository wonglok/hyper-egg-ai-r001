'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { Color, ShaderMaterial } from 'three'
import { MathUtils } from 'three'
// import { useRainbow } from 'ui/store/useRainbow'

export function AuraBar({}) {
  return (
    <>
      <div className="w-full h-full">
        <Canvas gl={{ alpha: true }}>
          <ViewArea active={true}></ViewArea>
        </Canvas>
      </div>
    </>
  )
}

function ViewArea({ active }) {
  let scene = useThree((r) => r.scene)
  let gl = useThree((r) => r.gl)
  let viewport = useThree((r) => r.viewport)

  useEffect(() => {
    gl.setClearAlpha(0)
    gl.setClearColor('#ffffff', 0)
  }, [scene])

  let uniforms = useMemo(() => {
    return {
      opacity: { value: 1.0 },
      primaryColor: { value: new Color(`#dae6ff`).convertLinearToSRGB() },
      time: { value: 0 }
    }
  }, [])

  useFrame((st, dt) => {
    uniforms.time.value += dt * 1.5
    uniforms.opacity.value = MathUtils.damp(uniforms.opacity.value, active ? 1.0 : 0.0, 1.0, dt)

    if (uniforms.opacity.value > 0.001) {
      st.gl.render(st.scene, st.camera)
    }
  }, 100)

  let vertexShader = `
        varying vec2 vUv;
        void main (void) {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }       
    `

  let fragmentShader = `
    uniform vec3 primaryColor;
    uniform float opacity;

    uniform float time;
    varying vec2 vUv;

    void main (void) {
        float cycleX = sin((vUv.x) * 3.141592 + time);
        float cycleY = sin((vUv.x) * 2.0 * 3.141592 + time * 1.5);
        float cycleZ = sin((vUv.x) * 3.0 * 3.141592 + time * 2.0) * cos((vUv.x) * 3.0 * 3.141592 + time * 2.0);

        vec3 color = vec3(cycleX * 0.5 + 0.5, cycleY * 0.5 + 0.5, cycleZ * 0.5 + 0.5);
        
        float avgColor = (color.x + color.y + color.z) / 3.0;

        color = mix(color, vec3(avgColor), sin(3.141592 * 0.4 * (vUv.y)));

        gl_FragColor = vec4(
          vec3(
            color.r,
            color.g,
            color.b
          ), 
          (color.r + color.g + color.b) / 3.0
        );
    }

    `

  let shader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true
    })
  }, [uniforms, vertexShader, fragmentShader])

  return (
    <>
      <Plane
        scale={[viewport.width, viewport.height, 1]}
        key={shader.uuid + vertexShader + fragmentShader}
        material={shader}
      ></Plane>
    </>
  )
}
