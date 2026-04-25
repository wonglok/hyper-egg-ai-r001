// @ts-nocheck

// Three.js Transpiler r183

import { mat2, sin, Fn, float, mul, add } from 'three/tsl'
import { Node, PackFloatNode, UnpackFloatNode } from 'three/webgpu'

const m = mat2(0.8, 0.6, -0.6, 0.8)

/* NEW GLSL NOISE FBM */

export const noise = /*@__PURE__*/ Fn(
  ([p]) => {
    return sin(p.x).mul(sin(p.y))
  },
  { p: 'vec2', return: 'float' }
)

export const fbm4 = /*@__PURE__*/ Fn(
  ([p_immutable]) => {
    const p = p_immutable.toVar()
    const f = float(0.0)
    f.addAssign(mul(0.5, noise(p)))
    p.assign(m.mul(p).mul(2.02))
    f.addAssign(mul(0.25, noise(p)))
    p.assign(m.mul(p).mul(2.03))
    f.addAssign(mul(0.125, noise(p)))
    p.assign(m.mul(p).mul(2.01))
    f.addAssign(mul(0.0625, noise(p)))

    return f.div(0.9375)
  },
  { p: 'vec2', return: 'float' }
)

export const fbm6 = /*@__PURE__*/ Fn(
  ([p_immutable]) => {
    const p = p_immutable.toVar()
    const f = float(0.0)
    f.addAssign(mul(0.5, add(0.5, mul(0.5, noise(p)))))
    p.assign(m.mul(p).mul(2.02))
    f.addAssign(mul(0.25, add(0.5, mul(0.5, noise(p)))))
    p.assign(m.mul(p).mul(2.03))
    f.addAssign(mul(0.125, add(0.5, mul(0.5, noise(p)))))
    p.assign(m.mul(p).mul(2.01))
    f.addAssign(mul(0.0625, add(0.5, mul(0.5, noise(p)))))
    p.assign(m.mul(p).mul(2.04))
    f.addAssign(mul(0.03125, add(0.5, mul(0.5, noise(p)))))
    p.assign(m.mul(p).mul(2.01))
    f.addAssign(mul(0.015625, add(0.5, mul(0.5, noise(p)))))

    return f.div(0.96875)
  },
  { p: 'vec2', return: 'float' }
)

export const pattern: (a: Node<'vec2'>, b: Node<'float'>) => Node<'float'> = /*@__PURE__*/ Fn(
  ([p, time]) => {
    const vout = fbm4(p.add(time).add(fbm6(p.add(fbm4(p.add(time))))))

    return vout
  },
  { p: 'vec2', time: 'float', return: 'float' }
)
