import { TooltipProvider } from '@/components/ui/tooltip'
import { AppRouter } from './router/Router'
import { Toaster } from 'sonner'
// import { useEffect } from 'react'
function App(): React.JSX.Element {
  return (
    <>
      <div className="w-full h-full overflow-hidden">
        <TooltipProvider>
          <AppRouter></AppRouter>
        </TooltipProvider>
        <Toaster></Toaster>
      </div>
    </>
  )
}

export default App
