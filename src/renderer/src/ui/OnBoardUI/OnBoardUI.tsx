import {
  ArrowBigRight,
  ArrowDownRight,
  ArrowRightIcon,
  ArrowUpRight,
  EggIcon,
  LinkIcon,
  WineIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Environment, OrbitControls, PerspectiveCamera, useEnvironment } from '@react-three/drei'
import { Suspense } from 'react'
import { CanvasGPU } from '../workspace/3d/CanvasGPU/CanvasGPU'
import { DiamondCompos } from '../workspace/3d/DiamondTSL/DiamondComponent'
import { BloomPipeline } from '../workspace/3d/CanvasGPU/BloomPipeline'
import { DiamondCanvas } from '../workspace/3d/DiamondTSL/DiamondCanvas'
import { useNavigate } from 'react-router-dom'
// import { Canvas, useThree } from '@react-three/fiber'
// import { AuraEffect } from '@renderer/effects/AuraEffect'
// import { SearchBar } from '@renderer/effects/SearchBar'

//

export function OnBoardUI() {
  let [spaces, setSpaces] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const controller = window.api.askAI(
      {
        route: 'listWorkspaces'
      },
      (stream) => {
        //
        const resp = JSON.parse(stream)
        console.log(resp)
      }
    )

    controller.getDataAsync().then((data) => {
      setSpaces(data.workspaces)
    })
  }, [])

  return (
    <>
      <div className=" absolute top-0 left-0 w-full h-full bg-gray-200 from-[#5bffff] to-[#ffc020] bg-linear-[0deg] ">
        <div className=" absolute top-[0px] left-[0px] w-full h-full  bg-radial from-[rgba(255,195,177,0.72)] to-transparent"></div>
        <DiamondCanvas></DiamondCanvas>
      </div>

      <div
        className=" absolute"
        style={{
          top: `calc(50% - 45% / 2)`,
          left: `calc(50% - 45% / 2)`,
          width: `45%`,
          height: `45%`
        }}
      >
        <div className="w-full h-full flex items-center justify-center  relative">
          <div>
            <div className="text-white  text-shadow-2xs text-[50px] mb-3 flex justify-center items-center mx-12">
              HyperEgg AI
            </div>
            <div className="text-white  text-shadow-2xs text-center">
              {spaces.map((space) => {
                return (
                  <div
                    className=" border p-2 rounded-lg text-#ffffff bg-[#000000]/30 cursor-pointer transition-colors hover:bg-[#8c8c8c]/50 hover:text-[#ffffff] select-none mb-3 flex justify-center items-center"
                    key={space.name}
                    onClick={() => {
                      //
                      console.log('on click')
                      navigate(`/workspace/${space.name}`)
                    }}
                  >
                    {space.name} <ArrowUpRight className="ml-2"></ArrowUpRight>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
