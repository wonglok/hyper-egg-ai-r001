// import { AppSidebar } from '@/components/app-sidebar'
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator
// } from '@/components/ui/breadcrumb'
// import { Separator } from '@/components/ui/separator'
// import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
// import { Environment, OrbitControls, PerspectiveCamera, useEnvironment } from '@react-three/drei'
// import { Canvas, useThree } from '@react-three/fiber'
// import { AuraEffect } from '@renderer/effects/AuraEffect'
// import { SearchBar } from '@renderer/effects/AuraBar'

// import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { SerachIndexGrid } from './serach-index/SerachIndexGrid'

// import { Suspense, useEffect } from 'react'

// import hdr from './assets/brown_photostudio_02_1k.hdr?url'
// import { CanvasGPU } from './3d/CanvasGPU/CanvasGPU'
// import { DiamondCompos } from './3d/DiamondTSL/DiamondComponent'
// import { BloomPipeline } from './3d/CanvasGPU/BloomPipeline'
// import { DiamondCanvas } from './3d/DiamondTSL/DiamondCanvas'

export function Index({ name = '' }) {
  //
  // let [controller, setCtrl] = useState(null)
  let [list, setList] = useState([])
  useEffect(() => {
    //
    const controller = window.api.askAI(
      {
        workspace: name,
        route: 'monitorProgress'
      },
      (stream) => {
        //
        const resp = JSON.parse(stream)
        // console.log(resp)

        if (resp.type === 'list') {
          setList(resp.list)
        }
      }
    )

    controller.getDataAsync().then((data) => {
      console.log(data)
    })
    //

    // setCtrl(controller)

    return () => {
      controller.abort()
    }
    //
  }, [name])

  //

  return (
    <>
      <div className="w-full relative py-4 px-4 h-full overflow-y-scroll">
        <div className="mb-2 text-2xl font-bold">Indexing Status of the Local Serach Engine</div>

        <div className="w-full h-full ">
          {list.length > 0 && <SerachIndexGrid list={list}></SerachIndexGrid>}
        </div>
      </div>
    </>
  )
}

//
