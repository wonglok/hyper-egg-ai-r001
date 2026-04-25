import { useEffect, useRef } from 'react'
import { MathUtils } from 'three'

export function Scroller({ reloader = '', className, children }) {
  let ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let tt = setInterval(() => {
      if (ref.current.scrollTop === ref.current.scrollHeight) {
        return
      }
      ref.current.scrollTop = MathUtils.lerp(ref.current.scrollTop, ref.current.scrollHeight, 0.01)
    })

    let tout = setTimeout(() => {
      clearInterval(tt)
    }, 2000)

    return () => {
      clearInterval(tt)
      clearTimeout(tout)
    }
  }, [reloader])

  return (
    <>
      <div ref={ref} className={`${className} overflow-y-scroll`}>
        {children}
      </div>
    </>
  )
}
