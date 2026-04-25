import { Button } from '@/components/ui/button'
// import { useHome } from '@renderer/ui/HyperHome/useHome'
import { useNavigate } from 'react-router-dom'

let PROTECTED_WORKSPACES = ['Personal', 'Work']

export function AdvancedSettings({ name }) {
  const navigate = useNavigate()

  const workspace = name

  return (
    <>
      <div className="w-full h-full bg-white p-3">
        <div className="text-2xl">Workspace: {name}</div>
        {
          <Button
            disabled={PROTECTED_WORKSPACES.includes(name)}
            variant="destructive"
            onClick={() => {
              //

              if (!confirm('remove')) {
                return
              }

              const controller = window.api.askAI(
                {
                  route: 'removeWorkspaceFolder',

                  workspace: workspace
                },
                (stream) => {
                  const resp = JSON.parse(stream)
                  console.log('removeWorkspaceFolder:event', resp)

                  // if (resp.folder) {
                  //   window.dispatchEvent(new CustomEvent('refresh-watcher', { detail: {} }))
                  //   useHome.setState({
                  //     folder: resp.folder
                  //   })
                  // }
                }
              )

              navigate(`/`)

              console.log(controller)

              //
            }}
          >
            {PROTECTED_WORKSPACES.includes(name) ? `Cannot Remove` : `Remove Workspace`}
          </Button>
        }
      </div>
    </>
  )
}
