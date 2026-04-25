import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uSpeed;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));
  
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for(int i = 0; i < 4; i++) {
    value += amplitude * smoothNoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed;
  
  float dist = length(vPosition.xy);
  
  float noise1 = fbm(uv * 3.0 + time * 0.5);
  float noise2 = fbm(uv * 5.0 - time * 0.3);
  float combinedNoise = (noise1 + noise2) * 0.5;
  
  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
  
  float aura = fresnel * (1.0 - dist * 0.5);
  aura *= combinedNoise * 2.0;
  aura *= uIntensity;
  
  float pulse = sin(time * 2.0) * 0.1 + 0.9;
  aura *= pulse;
  
  vec3 color = uColor;
  color += vec3(combinedNoise * 0.2);
  
  float alpha = aura * (1.0 - smoothstep(0.0, 1.0, dist));
  alpha = clamp(alpha, 0.0, 1.0);
  
  gl_FragColor = vec4(color * aura, alpha);
}
`

interface AuraEffectProps {
  color?: THREE.ColorRepresentation
  intensity?: number
  speed?: number
  radius?: number
}

export function AuraEffect({
  color = '#00ffff',
  intensity = 1.5,
  speed = 1.0,
  radius = 2
}: AuraEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uSpeed: { value: speed }
    }),
    [color, intensity, speed]
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} scale={[radius, radius, radius]}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        // depthWrite={false}
        // blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
