import {
  Box,
  CameraControls,
  DragControls,
  Html,
  OrbitControls,
  PerspectiveCamera
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useStudy } from '../useStudy'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning'
import { ArtifactElement } from './ArtifactElement'
import { Scroller } from './Scroller'
import { useEffect, useMemo, useRef } from 'react'
import { MathUtils, Vector3 } from 'three'
import { Group } from 'three'
import gsap from 'gsap'
import { Component } from 'lucide-react'

export function BubbleCanvas() {
  return (
    <>
      <Canvas>
        <BubbleCanvasCore></BubbleCanvasCore>
      </Canvas>
    </>
  )
}
function BubbleCanvasCore() {
  let refOrbit = useRef<any>(null)

  let thinking = useStudy((r) => r.thinking)
  let plan = useStudy((r) => r.plan)
  // let activate3D = useStudy((r) => r.activate3D)

  let scene = useThree((r) => r.scene)

  let list = [
    {
      id: 'thinking001',
      type: 'thinking',
      text: thinking,
      active: true
    },
    {
      id: 'plan001',
      type: 'plan',
      text: plan,
      active: false
    }
  ]

  let phase = useStudy((r) => r.phase)

  let offset = useRef(0)

  let dY = useRef(0)

  useEffect(() => {
    let tt = (ev) => {
      dY.current += ev.deltaY / 2500
      // dY.current += -ev.deltaX / 1000
    }
    window.addEventListener('wheel', tt)
    return () => {
      window.removeEventListener('wheel', tt)
    }
  }, [])

  useFrame((_) => {
    dY.current = dY.current * 0.9

    offset.current += dY.current

    // offset.current = offset.current % (list.length * 13)

    // if (activate3D) {
    // } else {
    //   list.forEach((item, idx) => {
    //     const object = scene.getObjectByName(item.id)
    //     if (object) {
    //       object.position.x = MathUtils.lerp(object.position.x, 0, 0.1)
    //       object.position.y = MathUtils.lerp(object.position.y, 0, 0.1)
    //       object.position.z = MathUtils.lerp(object.position.z, 0, 0.1)

    //       object.rotation.x = MathUtils.lerp(object.rotation.x, 0, 0.05)
    //       object.rotation.y = MathUtils.lerp(object.rotation.y, 0, 0.05)
    //       object.rotation.z = MathUtils.lerp(object.rotation.z, 0, 0.05)

    //       if (item.active) {
    //         object.scale.x = MathUtils.lerp(object.scale.x, 1, 0.15)
    //         object.scale.y = MathUtils.lerp(object.scale.y, 1, 0.15)
    //         object.scale.z = MathUtils.lerp(object.scale.z, 1, 0.15)
    //       } else {
    //         object.scale.x = MathUtils.lerp(object.scale.x, 0, 0.15)
    //         object.scale.y = MathUtils.lerp(object.scale.y, 0, 0.15)
    //         object.scale.z = MathUtils.lerp(object.scale.z, 0, 0.15)
    //       }
    //     }
    //   })
    // }

    list.forEach((item, idx) => {
      let ee = idx

      const object = scene.getObjectByName(item.id)
      if (object) {
        object.position.x = MathUtils.lerp(object.position.x, 0, 0.05)
        object.position.y = MathUtils.lerp(object.position.y, ee * -3.5 + offset.current, 0.05)
        object.position.z = MathUtils.lerp(object.position.z, 0, 0.05)

        object.rotation.x = MathUtils.lerp(object.rotation.x, 0.4, 0.05)
        object.rotation.y = MathUtils.lerp(object.rotation.y, 0, 0.05)
        object.rotation.z = MathUtils.lerp(object.rotation.z, 0, 0.05)

        object.scale.x = MathUtils.lerp(object.scale.x, 1, 0.05)
        object.scale.y = MathUtils.lerp(object.scale.y, 1, 0.05)
        object.scale.z = MathUtils.lerp(object.scale.z, 1, 0.05)
      }
    })

    //
  })

  return (
    <>
      {list.map((item, idx) => {
        //

        if (item.type === 'thinking') {
          return (
            <group name={item.id} key={item.id}>
              <Thinking list={list} item={item} idx={idx}></Thinking>
            </group>
          )
        }

        if (item.type === 'plan') {
          return (
            <group name={item.id} key={item.id}>
              <Plan list={list} item={item} key={item.id} idx={idx}></Plan>
            </group>
          )
        }

        return null
      })}

      <PerspectiveCamera makeDefault fov={50} position={[0, 0, 20]}></PerspectiveCamera>

      <OrbitControls
        ref={refOrbit}
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
        makeDefault
      />
    </>
  )
}

const Plan = ({ item, idx, list }) => {
  let activate3D = useStudy((r) => r.activate3D)
  return (
    <group userData={item} name={item.id} key={item.id}>
      <Html zIndexRange={[idx, 200]} center transform>
        <div className="w-full h-full relative">
          <Scroller
            reloader={item.text}
            className={'w-[600px] overflow-scroll p-3 border rounded-lg bg-white h-[500px]'}
          >
            <ArtifactElement
              activate3D={activate3D}
              plan={item.text}
              title={`Execution Plan`}
              description={`Analysing Folder`}
              zoomToggle={() => {
                // list.map((li) => {
                //   if (li.id === item.id) {
                //     item.active = true
                //   } else {
                //     item.active = false
                //   }
                // })
                // useStudy.setState({
                //   activate3D: false
                // })
              }}
            ></ArtifactElement>
          </Scroller>
        </div>
      </Html>
    </group>
  )
}

const Thinking = ({ item, idx, list }) => {
  // let activate3D = useStudy((r) => r.activate3D)
  return (
    <group userData={item} name={item.id} key={item.id}>
      <Html zIndexRange={[idx, 200]} center transform>
        <Scroller
          reloader={item.text}
          className={'w-[600px] overflow-scroll p-3 border rounded-lg bg-white h-[500px]'}
        >
          <div>
            <Reasoning open>
              <ReasoningTrigger />
              <ReasoningContent
                onClick={() => {
                  // list.map((li) => {
                  //   if (li.id === item.id) {
                  //     item.active = true
                  //   } else {
                  //     item.active = false
                  //   }
                  // })
                  // useStudy.setState({
                  //   activate3D: false
                  // })
                }}
              >{`${item.text}`}</ReasoningContent>
            </Reasoning>
          </div>
        </Scroller>
      </Html>
    </group>
  )
}
