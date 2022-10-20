import { useState, useEffect, ReactElement } from 'react'

interface DelayedComponentTypes {
  children: ReactElement
  waitBeforeShow: number
}

const Delayed: React.FC<DelayedComponentTypes> = ({ children, waitBeforeShow = 300 }: any) => {
  const [isShown, setIsShown] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true)
    }, waitBeforeShow)
    return () => clearTimeout(timer)
  }, [waitBeforeShow])

  return isShown ? children : null
}

export default Delayed
