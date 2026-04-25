'use client'
//
// Copyright © 2026 Wong Lok. MIT Lincesed
// Praise Jesus
//

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { create } from 'zustand'
import * as THREE from 'three/webgpu'
import { Canvas, extend, type ThreeToJSXElements } from '@react-three/fiber'
import { DRACOLoader, GLTFLoader, HDRLoader } from 'three/examples/jsm/Addons.js'
import { useRef } from 'react'

declare module '@react-three/fiber' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any)

export const rgbeLoader = new HDRLoader()

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(`/draco/`)

export const glbLoader = new GLTFLoader()
glbLoader.setDRACOLoader(dracoLoader)

//

export const CanvasGPU: any = ({
  children,
  webgl = false
}: {
  webgl?: boolean
  children?: any
}) => {
  const ref = useRef<HTMLDivElement>(null)

  let dpr = typeof window !== 'undefined' ? window?.devicePixelRatio || 1 : 1

  if (dpr >= 2) {
    dpr = dpr / 2
  } else if (dpr > 1) {
    dpr = 1
  }

  // if (webgl) {
  //   dpr = typeof window !== "undefined" ? window?.devicePixelRatio || 1 : 1;
  // }

  let [ok, setOK] = useState(false)
  return (
    <>
      <div className="w-full h-full relative" ref={ref}>
        <Canvas
          //
          dpr={[1, dpr]}
          shadows="soft"
          gl={async (props: any): Promise<any> => {
            const renderer = new THREE.WebGPURenderer({
              ...(props as any),
              alpha: false,
              antialias: false,
              multiview: true
            })

            await renderer.init()

            renderer.toneMapping = THREE.NoToneMapping
            renderer.toneMappingExposure = 1

            if (ref.current) {
              const rect = ref.current.getBoundingClientRect()
              renderer.setSize(rect.width, rect.height, true)
            }

            renderer.setPixelRatio(dpr)

            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = THREE.PCFSoftShadowMap

            renderer.render(
              new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)),
              new THREE.PerspectiveCamera(1, 1, 0.1, 1000)
            )

            setOK(true)

            return renderer
          }}
        >
          {ok && children}
        </Canvas>
      </div>
    </>
  )
}

export const importJSONToStore = (store: StoreType, dataJSON: any) => {
  const state: any = store.getState()
  const keys = Object.keys(getSerilisableState())

  for (const key of keys) {
    state[key] = dataJSON[key]
  }

  // close panel
  store.setState({ ...state, activeNodeHash: '' })

  return
}

export const exportJSONFromStore = (store: StoreType) => {
  const state: any = store.getState()
  const keys = Object.keys(getSerilisableState())
  const output: any = {}
  for (const key of keys) {
    output[key] = state[key]
  }

  return output
}

const getSerilisableState = () => {
  return {
    //
  }
}

const createInitialState = (set: (a: any) => void, get: () => any) => {
  return {
    //
    //
    // program state
    ...getSerilisableState()
  }
}

export type AppInitStateType = Awaited<ReturnType<typeof createInitialState>>

const getStateStore = () => {
  return create<AppInitStateType>((set, get) => {
    return createInitialState(set, get)
  })
}

type StoreType = Awaited<ReturnType<typeof getStateStore>>

const RawContextApp = createContext<StoreType>(getStateStore())

export const CoreContext = ({
  children,
  state = null,
  subscribe = (a: AppInitStateType, b: AppInitStateType) => {}
}: {
  children?: ReactNode
  state?: AppInitStateType | Partial<AppInitStateType> | null
  subscribe?: (a: AppInitStateType, b: AppInitStateType) => void
}) => {
  const store = useMemo(() => {
    return getStateStore()
  }, [])

  useEffect(() => {
    if (!subscribe) {
      return
    }
    return store.subscribe(subscribe)
  }, [subscribe])

  useEffect(() => {
    if (state && store) {
      store.setState(state)
    }
  }, [state, store])

  return (
    <>
      {store && (
        <RawContextApp.Provider value={store}>
          <SetDefaltValue store={store}>
            <>{children}</>
          </SetDefaltValue>
        </RawContextApp.Provider>
      )}
    </>
  )
}

export const GlobalStore = {
  store: null as StoreType | null
}

export const SetDefaltValue = ({
  store,
  children
}: {
  children?: ReactNode
  store: StoreType | null
}) => {
  useEffect(() => {
    if (store) {
      GlobalStore.store = store
    }
  }, [store])

  return children
}

export const useCore = (fnc: (state: AppInitStateType) => any) => {
  const useCore = useContext(RawContextApp)
  return useCore(fnc)
}

export const setStateCore = (values = {}) => {
  if (GlobalStore.store) {
    GlobalStore.store.setState(values)
  } else {
    const ttt = setInterval(() => {
      if (GlobalStore.store) {
        clearInterval(ttt)
        GlobalStore.store.setState(values)
      }
    })
  }
}

export const useStoreOfCoreContext = () => {
  const useCore2 = useContext(RawContextApp)
  return useCore2
}
