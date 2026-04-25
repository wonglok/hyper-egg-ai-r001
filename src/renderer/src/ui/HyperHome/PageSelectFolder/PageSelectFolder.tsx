// import { useEffect, useState } from 'react'
// import { useHome } from './useHome'
// import nprogress from 'nprogress'
// import { CanvasGPU } from '../../workspace/3d/CanvasGPU/CanvasGPU'
// import { RoomFX } from '../../workspace/3d/RoomFX/RoomFX'
// import { Environment, Gltf, OrbitControls, PerspectiveCamera } from '@react-three/drei'
// import { BloomPipeline } from '../../workspace/3d/CanvasGPU/BloomPipeline'
// import { EnvLoader } from '../../workspace/3d/CanvasGPU/EnvLoader'
// import { toast } from 'sonner'
// import hdr from '../../../ui/workspace/3d/assets/factory.hdr?url'

// import { CenterMe } from './ProcedureModules/CenterMe'
// import desk from './assets/room/desk-transformed.glb?url'

import { FolderSelect } from './FolderSelect'
import { DeskMesh } from './DeskMesh'
import { Flex, Box } from '@react-three/flex'
import { useHome } from '../useHome'
import { GeneralButton } from './GeneralButton'
// import { useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { CenterMe } from './CenterMe'
import { useNavigate } from 'react-router-dom'

export function PageSelectFolder({ workspace }) {
  const folder = useHome((r) => r.folder)

  const navigate = useNavigate()

  const onSelectFolder = (ev) => {
    ev.stopPropagation()

    const controller = window.api.askAI(
      {
        route: 'selectWorkspaceFolder',

        workspace: workspace
      },
      (stream) => {
        const resp = JSON.parse(stream)
        console.log('selectWorkspaceFolder', resp)

        if (resp.folder) {
          window.dispatchEvent(new CustomEvent('refresh-watcher', { detail: {} }))

          useHome.setState({
            folder: resp.folder
          })
          navigate(`/workspace/${workspace}/index`)
        }
      }
    )

    controller.getDataAsync().then(() => {
      window.dispatchEvent(new CustomEvent('refresh-watcher', { detail: {} }))
    })
  }

  const onEnterPage = (ev) => {
    ev.stopPropagation()

    const controller = window.api.askAI(
      {
        workspace: workspace,
        route: 'openPath'
      },
      (stream) => {
        //
        const resp = JSON.parse(stream)
        console.log(resp)
      }
    )

    controller.getDataAsync().then((data) => {
      //
    })
  }

  return (
    <>
      <OrbitControls
        makeDefault
        object-position={[0, 3.5, 3.5]}
        target={[0, 2, 0]}
        minDistance={3}
        maxDistance={7}
        minAzimuthAngle={-0.25 * Math.PI}
        maxAzimuthAngle={0.25 * Math.PI}
        maxPolarAngle={0.5 * Math.PI}
        minPolarAngle={0.25 * Math.PI}
      ></OrbitControls>

      <DeskMesh></DeskMesh>

      <group rotation={[Math.PI * -0.15, 0, 0]} position={[0, 2, 0.0]}>
        <CenterMe>
          {/* @ts-ignore */}
          <Flex centerAnchor justifyContent="center" alignItems="center">
            {/* @ts-ignore */}
            <Box centerAnchor margin={0.1}>
              <group onClick={onSelectFolder}>
                <group
                  scale={0.5}
                  position={[0, 0, 0]}
                  rotation={[Math.PI * 0.25, 0, 0]}
                  //
                  onClick={onSelectFolder}
                >
                  <FolderSelect></FolderSelect>
                </group>
              </group>
            </Box>

            {/* @ts-ignore */}
            <Box centerAnchor margin={0.1}>
              <group onClick={onSelectFolder}>
                <GeneralButton
                  title={`Select AI Folder`}
                  bgNormal={'#8677ff'}
                  bgHover={'#1e00ff'}
                  textNormal={'#ffffff'}
                  textHover={'#ffffff'}
                  width={6.5}
                ></GeneralButton>
              </group>
            </Box>

            {workspace && (
              <>
                {/* @ts-ignore */}
                <Box centerAnchor margin={0.1}>
                  <group scale={0.5}>
                    <GeneralButton
                      key={workspace}
                      title={`Workspace: ${workspace}`}
                      bgNormal={'#ffffff'}
                      bgHover={'#ffffff'}
                      textNormal={'#000000'}
                      textHover={'#000000'}
                      width={3}
                    ></GeneralButton>
                  </group>
                </Box>
              </>
            )}

            {folder && (
              <>
                {/* @ts-ignore */}
                <Box centerAnchor margin={0.1}>
                  <group scale={0.5}>
                    <GeneralButton
                      key={folder}
                      title={`Chosen: ${folder}`}
                      bgNormal={'#ffffff'}
                      bgHover={'#ffffff'}
                      textNormal={'#000000'}
                      textHover={'#000000'}
                      width={3}
                    ></GeneralButton>
                  </group>
                </Box>
              </>
            )}

            {folder && (
              <>
                {/* @ts-ignore */}
                <Box centerAnchor margin={0.1}>
                  <group
                    onClick={(ev) => {
                      //
                      // onEnterPage
                      //
                      onEnterPage(ev)
                    }}
                  >
                    <GeneralButton
                      title={'Open'}
                      bgNormal={'#8677ff'}
                      bgHover={'#1e00ff'}
                      textNormal={'#ffffff'}
                      textHover={'#ffffff'}
                      width={3}
                    ></GeneralButton>
                  </group>
                </Box>
              </>
            )}
          </Flex>
        </CenterMe>
      </group>
    </>
  )
}
