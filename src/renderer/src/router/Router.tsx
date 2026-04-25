// import { LMStudioManager } from '@renderer/adapter/LMStudioManager'
// import AIPicker from '@renderer/components/AIPicker'
// import Versions from '@renderer/components/Versions'
// import { Link, Redirect, Route, Switch } from 'wouter'
import { HashRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom'

import { LMStudioManager } from '../adapter/LMStudioManager'
// import Versions from '@renderer/gui/Versions'
// import AIPicker from '@renderer/gui/AIPicker'
// import { Setup } from '@renderer/pages/Setup'
// import { Embeddings } from '@renderer/pages/Embeddings'
// import { RecursiveAI } from '@renderer/pages/RecursiveAI'
// import { Skill } from '@renderer/pages/Skill'
import { OnBoard } from '@renderer/pages/OnBoard'
import { WorkspaceLayout } from '@renderer/ui/workspace/WorkspaceParent'
import { Index } from '@renderer/ui/workspace/index-files'
import { HyperHome } from '@renderer/ui/HyperHome/PageSelectFolder/HyperHome'
import { HyperFiles } from '@renderer/ui/HyperHome/PageViewFiles/HyperFiles'
import { useEffect, useState } from 'react'
import { useHome } from '@renderer/ui/HyperHome/useHome'
// import { FileWatcher } from './FileWatcher'
// import { AllFiles } from './AllFiles'
import { AdvancedSettings } from '@renderer/ui/workspace/AdvancedSettings/AdvancedSettings'
import { StudyFiles } from '@renderer/ui/workspace/StudyFiles/StudyFiles'
// import { SearchBar } from '@renderer/effects/SearchBar'

// if (import.meta.env.DEV) {
//   location.hash = '#/workspace/Personal/study-files'
// }

export const AppRouter = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          {/*  */}

          {/* <Route
            path="onboard"
            element={
              <>
                <OnBoard></OnBoard>
              </>
            }
          ></Route> */}

          <Route
            path="workspace/:name/setup"
            element={
              <>
                <NamedParams>
                  {(params) => {
                    return (
                      <WorkspaceLayout name={params.name}>
                        <LMStudioManager></LMStudioManager>
                      </WorkspaceLayout>
                    )
                  }}
                </NamedParams>
              </>
            }
          ></Route>

          <Route
            path="workspace/:name/index" // serach engine index
            element={
              <>
                <NamedParams>
                  {(params) => {
                    return (
                      <WorkspaceLayout name={params.name}>
                        <Index name={params.name}></Index>
                      </WorkspaceLayout>
                    )
                  }}
                </NamedParams>
              </>
            }
          ></Route>

          <Route
            path="workspace/:name/study-files"
            element={
              <>
                <NamedParams>
                  {(params) => {
                    return (
                      <WorkspaceLayout name={params.name}>
                        <StudyFiles name={params.name}></StudyFiles>
                      </WorkspaceLayout>
                    )
                  }}
                </NamedParams>
              </>
            }
          ></Route>

          <Route
            path="workspace/:name/settings"
            element={
              <>
                <NamedParams>
                  {(params) => {
                    return (
                      <WorkspaceLayout name={params.name}>
                        <HyperHome workspaceName={params.name}></HyperHome>
                      </WorkspaceLayout>
                    )
                  }}
                </NamedParams>
              </>
            }
          ></Route>

          <Route
            path="workspace/:name/files"
            element={
              <>
                <NamedParams>
                  {(params) => {
                    return (
                      <WorkspaceLayout name={params.name}>
                        <RedirectToHyper workspace={params.name}></RedirectToHyper>
                        {/* <HyperFiles workspaceName={params.name}></HyperFiles> */}
                      </WorkspaceLayout>
                    )
                  }}
                </NamedParams>
              </>
            }
          ></Route>

          <Route
            path="workspace/:name"
            element={
              <>
                <NamedParams>
                  {(params) => {
                    console.log(params)

                    return (
                      <WorkspaceLayout name={params.name}>
                        <RedirectToHyper workspace={params.name}></RedirectToHyper>
                      </WorkspaceLayout>
                    )
                  }}
                </NamedParams>
              </>
            }
          ></Route>

          <Route
            path="workspace/:name/advanced-settings"
            element={
              <>
                <NamedParams>
                  {(params) => {
                    return (
                      <WorkspaceLayout name={params.name}>
                        <AdvancedSettings name={params.name}></AdvancedSettings>
                      </WorkspaceLayout>
                    )
                  }}
                </NamedParams>
              </>
            }
          ></Route>

          <Route
            path="/"
            element={
              <>
                <OnBoard></OnBoard>
              </>
            }
          ></Route>
        </Routes>

        {/*  */}
      </HashRouter>
      {/* <HashRouter>
        <Routes>
          <Route
            path={`workspaceName/:name*`}
            element={
              <NamedParams>
                {(params) => {
                  return <Switcher workspace={params.name}></Switcher>
                }}
              </NamedParams>
            }
          ></Route>
        </Routes>
      </HashRouter> */}

      {/* <AllFiles></AllFiles> */}
    </>
  )
}

// function Switcher({ workspace }) {
//   let navigate = useNavigate()
//   useEffect(() => {
//     if (localStorage.getItem('pathanme-last')) {
//       navigate(`/workspace/${workspace}/${localStorage.getItem('pathanme-last')}`)
//     }

//     return () => {
//       if (location.hash.includes('#/workspace/' + workspace)) {
//         localStorage.setItem(
//           'pathanme-last',
//           location.hash.replace(`#/workspace/${workspace}/`, '')
//         )

//         console.log(localStorage.getItem('pathanme-last'))
//       }
//     }
//   }, [workspace])

//   return null
// }

function RedirectToHyper({ workspace = '' }) {
  let navigate = useNavigate()

  useEffect(() => {
    useHome
      .getState()
      .loadFolderConfig({})
      .then((folder) => {
        //
        console.log('redirect folder', folder)
        //

        if (folder) {
          navigate(`/workspace/${workspace}/study-files`)
        } else {
          navigate(`/workspace/${workspace}/settings`)
        }
        //
      })

    return () => {}
  }, [workspace])
  //

  //

  //
  return (
    <>
      {/*  */}

      {/*  */}
    </>
  )
}

function NamedParams({ children = (v: any) => {} }: any) {
  let params: any = useParams()
  // console.log(params)
  //
  return children(params)
}

// export function Others() {
//   return (
//     <>
//       <Link href="/users/1">Profile</Link>
//       <Link href="/lmstudio">Setup LMStudio</Link>
//       <Link href="/about">About</Link>
//       <Link href="/dashboard">Dash</Link>
//       <Link href="/">Home</Link>

//       {/*  */}
//       {/*  */}
//       {/*  */}
//       {/*  */}

//       <Route>
//         <div>404: No such page!</div>
//       </Route>
//       <Route path="about">
//         <div className="p-2 bg-red-500">Powered by electron-vite</div>
//         <div className="text">
//           Build an Electron app with <span className="react">React</span>
//           &nbsp;and <span className="ts">TypeScript</span>
//         </div>
//         <p className="tip">
//           Please try pressing <code>F12</code> to open the devTool
//         </p>
//         <div className="actions">
//           <div className="action">
//             <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
//               Documentation
//             </a>
//           </div>
//         </div>

//         <Versions></Versions>
//       </Route>
//       <div>
//         <AIPicker
//           onModelSelect={(model, provider) => {
//             console.log(model, provider)
//           }}
//         ></AIPicker>
//       </div>

//       <Route path="lmstudio">
//         <LMStudioManager></LMStudioManager>
//       </Route>
//       <Route path="dashboard">
//         <Home></Home>
//       </Route>
//       <Route path="users/:name">
//         {(params: any) => (
//           <>
//             <div>Home</div>
//             <div>Hello, {params.name}!</div>
//           </>
//         )}
//       </Route>
//     </>
//   )
// }
