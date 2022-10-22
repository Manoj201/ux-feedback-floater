import { useState, useEffect } from 'react'

import { DelayedComponentTypes } from '../../types/component.types'

const Delayed = ({ children, waitBeforeShow = 300 }: DelayedComponentTypes) => {
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
