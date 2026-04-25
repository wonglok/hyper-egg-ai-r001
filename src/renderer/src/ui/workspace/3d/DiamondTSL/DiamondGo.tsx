import {
  vec2,
  vec3,
  vec4,
  int,
  float,
  color,
  uniform,
  add,
  sub,
  mul,
  div,
  negate,
  abs,
  dot,
  normalize,
  sqrt,
  exp,
  pow,
  min,
  max,
  clamp,
  mix,
  greaterThan,
  equal,
  refract,
  reflect,
  cameraPosition,
  positionWorld,
  positionView,
  normalWorld,
  Fn,
  If,
  output,
  modelWorldMatrix,
  exp2,
  cubeTexture,
  Loop,
  modelWorldMatrixInverse
} from 'three/tsl'
import {
  Color,
  CubeTexture,
  MeshBasicNodeMaterial,
  MeshPhysicalNodeMaterial,
  NodeMaterial,
  Vector3
} from 'three/webgpu'

export function getDiamondSystem({
  normalCubeTex,
  envMapTex
}: {
  normalCubeTex: CubeTexture
  envMapTex: CubeTexture
}) {
  // ============================================
  // UNIFORMS
  // ============================================

  const uniforms = {
    // Cube map for diamond facet normals
    normalCube: normalCubeTex, // Set to your cube texture

    // Debug mode
    bDebugBounces: uniform(0),

    // Fresnel parameters
    mFresnelBias: uniform(0.02),
    mFresnelScale: uniform(0.1),
    mFresnelPower: uniform(1.0),

    // Optical properties
    aberration: uniform(0.012),
    refraction: uniform(2.47153), // Diamond IOR

    // Geometry adjustments
    normalOffset: uniform(0.0),
    squashFactor: uniform(0.98),
    distanceOffset: uniform(0.0),
    geometryFactor: uniform(0.17),

    // Color correction
    absorbption: uniform(new Color(0, 0, 0)),
    correction: uniform(new Color(0xffffff)),
    boost: uniform(color(0.892, 0.892, 0.98595025)),

    // Sphere approximation parameters
    radius: uniform(0.05),
    centreOffset: uniform(new Vector3(0, 0, 0))
  }

  // ============================================
  // VARYINGS (passed from vertex to fragment)finverse
  // ============================================

  // const o_ViewPosition = vec3() //, 'vViewPosition')
  // const o_WorldNormal = vec3() //, 'vWorldNormal')
  // const o_VecPos = vec3() //, 'vVecPos')
  // const o_I = vec3() //, 'vI')
  // const o_InvMat = mat4() //, 'vInvMat')
  // const o_ModelMatrix = mat4() //, 'vModelMatrix')

  // Pass varyings to fragment
  const vViewPosition = vec3(negate(positionView.xyz))
  const vWorldNormal = vec3(normalWorld)
  const vVecPos = vec3(positionWorld.xyz)
  const vI = vec3(normalize(sub(positionWorld.xyz, cameraPosition)))
  const vInvMat = modelWorldMatrixInverse
  const vModelMatrix = modelWorldMatrix

  // const vViewPosition = vec3(o_ViewPosition) //, 'vViewPosition')
  // const vWorldNormal = vec3(o_WorldNormal) //, 'vWorldNormal')
  // const vVecPos = vec3(o_VecPos) //, 'vVecPos')
  // const vI = vec3(o_I) //, 'vI')
  // const vInvMat = mat4(o_InvMat) //, 'vInvMat')
  // const vModelMatrix = mat4(o_ModelMatrix) //, 'vModelMatrix')

  // ============================================
  // VERTEX SHADER
  // ============================================

  const diamondVertexShader = Fn(() => {
    // // Standard transforms
    // const transformedNormal = normalView
    // const worldPosition = positionWorld

    return output
  })

  // ============================================
  // FRAGMENT HELPER FUNCTIONS
  // ============================================

  // BRDF Specular GGX Environment approximation
  const BRDF_Specular_GGX_Environment: any = Fn(
    ([viewDir, normal, specularColor, roughness]: any) => {
      const dotNV = abs(dot(normal, viewDir))

      const c0 = vec4(-1.0, -0.0275, -0.572, 0.022)
      const c1 = vec4(1.0, 0.0425, 1.04, -0.04)

      const r = add(mul(roughness, c0), c1)
      const a004 = add(mul(min(mul(r.x, r.x), exp2(mul(-9.28, dotNV))), r.x), r.y)
      const AB = add(mul(vec2(-1.04, 1.04), a004), r.zw)

      return add(mul(specularColor, AB.x), AB.y)
    }
  )

  // Sample environment map (specular reflection)
  const SampleSpecularReflection: any = Fn(([specularColor, direction]: any) => {
    // Flip X and Z for environment mapping
    const dir = vec3(negate(direction.x), direction.y, negate(direction.z))

    // Note: In TSL, you'd use your environment map here
    // This assumes you have a cube map or PMREM setup
    const sampleColor = cubeTexture(envMapTex, dir)
    return clamp(sampleColor, 0.0, 1.0)
  })

  // Sample environment with color contribution
  const SampleSpecularContribution: any = Fn(([specularColor, direction]: any) => {
    const dir = normalize(direction) as any
    const flippedDir = vec3(negate(dir.x), dir.y, negate(dir.z))

    const sampleColor = cubeTexture(envMapTex, flippedDir)
    return clamp(sampleColor, 0.0, 1.0)
  })

  // Ray-sphere intersection for internal diamond geometry
  const intersectSphere: any = Fn(([origin, direction]: any) => {
    const localOrigin = sub(origin, uniforms.centreOffset)

    // Apply squash factor to Y
    const dir = vec3(direction.x, div(direction.y, uniforms.squashFactor), direction.z)

    const A = dot(dir, dir)
    const B = mul(2.0, dot(localOrigin, dir))
    const C = sub(dot(localOrigin, localOrigin), mul(uniforms.radius, uniforms.radius))

    const disc = sub(mul(B, B), mul(mul(4.0, A), C))

    const result = vec3(0.0)

    If(greaterThan(disc, 0.0), () => {
      const sqrtDisc = sqrt(disc)
      const t1 = div(mul(add(negate(B), sqrtDisc), uniforms.geometryFactor), A)
      const t2 = div(mul(add(negate(B), negate(sqrtDisc)), uniforms.geometryFactor), A)
      const t = max(t1, t2)

      const finalDir = vec3(direction.x, mul(direction.y, uniforms.squashFactor), direction.z)
      result.assign(add(add(localOrigin, uniforms.centreOffset), mul(finalDir, t)))
    })

    return result
  })

  //
  // Debug bounce colors
  const debugBounces: any = Fn(([count]: any) => {
    const color = vec3(1.0, 1.0, 1.0)

    If(equal(count, int(0)), () => {
      color.assign(vec3(1.0, 0.0, 0.0))
    })
      .ElseIf(equal(count, int(1)), () => {
        color.assign(vec3(0.0, 1.0, 0.0))
      })
      .ElseIf(equal(count, int(2)), () => {
        color.assign(vec3(0.0, 0.0, 1.0))
      })
      .ElseIf(equal(count, int(3)), () => {
        color.assign(vec3(1.0, 1.0, 0.0))
      })
      .ElseIf(equal(count, int(4)), () => {
        color.assign(vec3(0.0, 1.0, 1.0))
      })
      .Else(() => {
        color.assign(vec3(0.0, 1.0, 0.0))
      })

    return color
  })

  // ============================================
  // MAIN RAY TRACING FUNCTION
  // ============================================

  const traceRay: any = Fn(([origin, direction, normal]: any) => {
    const invModelMat = vInvMat
    const outColor = vec3(0.0)

    // Constants
    const n1 = float(1.0)
    const epsilon = float(1e-8)

    // Calculate Fresnel reflectance at normal incidence
    const f0Temp = div(sub(uniforms.refraction, n1), add(uniforms.refraction, n1))
    const f0 = mul(f0Temp, f0Temp)

    const attenuationFactor = vec3(1.0).toVar()

    // Initial refraction entering the diamond
    const newDirectionTemp = refract(direction, normal, div(n1, uniforms.refraction))
    const reflectedDirection = reflect(direction, normal)

    const brdfReflected = BRDF_Specular_GGX_Environment(reflectedDirection, normal, vec3(f0), 0.0)

    const brdfRefracted = BRDF_Specular_GGX_Environment(
      newDirectionTemp,
      negate(normal),
      vec3(f0),
      0.0
    )

    attenuationFactor.assign(mul(attenuationFactor, sub(vec3(1.0), brdfRefracted)))
    outColor.addAssign(
      mul(SampleSpecularReflection(vec4(1.0), reflectedDirection).rgb, brdfReflected)
    )

    // Transform to local space
    const newDirection = normalize(invModelMat.mul(vec4(newDirectionTemp, 0.0)).xyz).toVar()
    const currentOrigin = invModelMat.mul(vec4(origin, 1.0)).xyz

    const count = int(0)

    const end = 5
    // Ray bounce loop
    Loop({ start: int(0), end: int(end) }, ({ i }) => {
      //
      const intersectedPos = intersectSphere(add(currentOrigin, vec3(epsilon)), newDirection)
      const dist = sub(intersectedPos, currentOrigin)
      const d = normalize(sub(intersectedPos, uniforms.centreOffset))

      // Sample normal from cube map
      const mappedNormalRaw = cubeTexture(normalCubeTex, d).xyz
      const mappedNormal = sub(mul(2.0, mappedNormalRaw), vec3(1.0))
      mappedNormal.assign(normalize(mappedNormal))

      // Transform distance to world space for absorption
      const distWorld = vModelMatrix.mul(vec4(dist, 1.0)).xyz
      const r = sqrt(dot(distWorld, distWorld)) as any

      // Apply absorption
      attenuationFactor.assign(
        //
        mul(attenuationFactor, exp(negate(mul(r, uniforms.absorbption as any))))
      )

      // Update position with offset
      const oldOrigin = currentOrigin
      currentOrigin.assign(
        sub(
          intersectedPos,
          mul(normalize(sub(intersectedPos, uniforms.centreOffset)), uniforms.distanceOffset)
        )
      )

      const oldDir = newDirection

      // Try to refract out //
      const refractResult = refract(newDirection, mappedNormal, div(uniforms.refraction, n1))

      // Check for Total Internal Reflection
      If(equal(dot(refractResult, refractResult), 0.0), () => {
        // TIR - continue inside
        newDirection.assign(reflect(oldDir, mappedNormal))

        // Escape hatch for trapped rays
        If(equal(i, int(end - 2)), () => {
          const brdfReflectedEsc = BRDF_Specular_GGX_Environment(
            negate(oldDir),
            mappedNormal,
            vec3(f0),
            0.0
          )
          const d1 = vModelMatrix.mul(vec4(oldDir, 0.0)).xyz
          const contrib = mul(
            SampleSpecularContribution(vec4(1.0), d1).rgb,
            mul(
              mul(mul(uniforms.correction as any, attenuationFactor), uniforms.boost as any),
              sub(vec3(1.0), brdfReflectedEsc)
            )
          )
          outColor.addAssign(contrib)
        })
      }).Else(() => {
        // Ray exits - calculate dispersion (RGB splitting)
        const brdfRefractedOut = BRDF_Specular_GGX_Environment(
          refractResult,
          negate(mappedNormal),
          vec3(f0),
          0.0
        )

        // Green channel (center)
        const d1 = vModelMatrix.mul(vec4(refractResult, 0.0)).xyz
        const colorG = mul(
          SampleSpecularContribution(vec4(1.0), d1).rgb,
          sub(vec3(1.0), brdfRefractedOut)
        )

        // Red channel (+aberration)
        const dirR = refract(
          oldDir,
          mappedNormal,
          div(add(uniforms.refraction, uniforms.aberration), n1)
        )
        const d2 = vModelMatrix.mul(vec4(dirR, 0.0)).xyz
        const colorR = mul(
          SampleSpecularContribution(vec4(1.0), d2).rgb,
          sub(vec3(1.0), brdfRefractedOut)
        )

        // Blue channel (-aberration)
        const dirB = refract(
          oldDir,
          mappedNormal,
          div(sub(uniforms.refraction, uniforms.aberration), n1)
        )
        const d3 = vModelMatrix.mul(vec4(dirB, 0.0)).xyz
        const colorB = mul(
          SampleSpecularContribution(vec4(1.0), d3).rgb,
          sub(vec3(1.0), brdfRefractedOut)
        )

        // Combine channels
        const combinedColor = vec3(colorR.r, colorG.g, colorB.b)
        outColor.addAssign(
          mul(
            mul(mul(combinedColor, uniforms.correction as any), attenuationFactor),
            uniforms.boost as any
          )
        )

        // Continue reflected ray inside
        newDirection.assign(reflect(oldDir, mappedNormal))
        const brdfReflectedIn = BRDF_Specular_GGX_Environment(
          newDirection,
          mappedNormal,
          vec3(f0),
          0.0
        )
        attenuationFactor.assign(
          mul(mul(attenuationFactor, brdfReflectedIn), uniforms.boost as any)
        )
        count.addAssign(int(1))
      })
    })

    // If(equal(uniforms.bDebugBounces, int(1)), () => {
    //   outColor.assign(debugBounces(count))
    // })

    return outColor
  })

  // ============================================
  // FRAGMENT SHADER
  // ============================================

  const diamondFragmentShader = Fn(() => {
    //
    //
    // Fresnel reflection factor
    const fresnel = add(
      uniforms.mFresnelBias,
      mul(
        uniforms.mFresnelScale,
        pow(abs(add(1.0, dot(normalize(vI), vWorldNormal))), uniforms.mFresnelPower)
      )
    )
    const vReflectionFactor = clamp(fresnel, 0.0, 1.0)

    const refractedColor = traceRay(vVecPos, vI, normalize(vWorldNormal))

    const finalColor = mix(
      refractedColor,
      mul(refractedColor, vec3(1.0)), // Replace with your standard lighting if needed
      vReflectionFactor
    )

    return vec4(finalColor, 1.0)
  })

  // ============================================
  // MATERIAL SETUP
  // ============================================

  function createDiamondMaterial() {
    uniforms.normalCube = normalCubeTex

    const material = new NodeMaterial()

    // Assign custom TSL shaders
    // material.vertexNode = diamondVertexShader()
    material.outputNode = diamondFragmentShader()

    return material
  }

  return {
    createDiamondMaterial,
    uniforms,
    diamondVertexShader,
    diamondFragmentShader,
    traceRay
  }
}
