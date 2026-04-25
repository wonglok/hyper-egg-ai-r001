import { Center } from '@react-three/drei'
import { useEffect, useState } from 'react'

export function CenterMe({ children, ...props }) {
  let [key, setKey] = useState(Math.random() + '')

  useEffect(() => {
    setKey(Math.random() + '')
  }, [children])

  return (
    <Center key={key} {...props}>
      {children}
    </Center>
  )
}
