/* eslint-disable no-case-declarations */
import getStroke from 'perfect-freehand'
import { useState } from 'react'

const createElement = (id, x1, y1, x2, y2, type, options, generator) => {
  switch (type) {
    case 'line':
    case 'rectangle':
      const roughElement =
        type === 'line'
          ? generator.line(x1, y1, x2, y2, { stroke: options.color })
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
              stroke: options.color,
            })
      return { id, x1, y1, x2, y2, type, options, roughElement }
    case 'pencil':
      return { id, type, points: [{ x: x1, y: y1 }], options }
    case 'text':
      return { id, type, x1, y1, x2, y2, text: '' }
    default:
      throw new Error(`Type not recognised: ${type}`)
  }
}

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null
}

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 }
  const b = { x: x2, y: y2 }
  const c = { x, y }
  const offset = distance(a, b) - (distance(a, c) + distance(b, c))
  return Math.abs(offset) < maxDistance ? 'inside' : null
}

const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element
  switch (type) {
    case 'line':
      const on = onLine(x1, y1, x2, y2, x, y)
      const start = nearPoint(x, y, x1, y1, 'start')
      const end = nearPoint(x, y, x2, y2, 'end')
      return start || end || on
    case 'rectangle':
      const topLeft = nearPoint(x, y, x1, y1, 'tl')
      const topRight = nearPoint(x, y, x2, y1, 'tr')
      const bottomLeft = nearPoint(x, y, x1, y2, 'bl')
      const bottomRight = nearPoint(x, y, x2, y2, 'br')
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null
      return topLeft || topRight || bottomLeft || bottomRight || inside
    case 'pencil':
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1]
        if (!nextPoint) return false
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
      })
      return betweenAnyPoint ? 'inside' : null
    case 'text':
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null
    default:
      throw new Error(`Type not recognised: ${type}`)
  }
}

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null)
}

const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element
  if (type === 'rectangle') {
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)
    return { x1: minX, y1: minY, x2: maxX, y2: maxY }
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 }
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 }
    }
  }
}

const cursorForPosition = (position) => {
  switch (position) {
    case 'tl':
    case 'br':
    case 'start':
    case 'end':
      return 'nwse-resize'
    case 'tr':
    case 'bl':
      return 'nesw-resize'
    default:
      return 'move'
  }
}

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates
  switch (position) {
    case 'tl':
    case 'start':
      return { x1: clientX, y1: clientY, x2, y2 }
    case 'tr':
      return { x1, y1: clientY, x2: clientX, y2 }
    case 'bl':
      return { x1: clientX, y1, x2, y2: clientY }
    case 'br':
    case 'end':
      return { x1, y1, x2: clientX, y2: clientY }
    default:
      return null //should not really get here...
  }
}

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState([initialState])

  const setState = (action, overwrite = false) => {
    const newState = typeof action === 'function' ? action(history[index]) : action
    if (overwrite) {
      const historyCopy = [...history]
      historyCopy[index] = newState
      setHistory(historyCopy)
    } else {
      const updatedState = [...history].slice(0, index + 1)
      setHistory([...updatedState, newState])
      setIndex((prevState) => prevState + 1)
    }
  }

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1)
  const redo = () => index < history.length - 1 && setIndex((prevState) => prevState + 1)

  const reset = () => setIndex(0)

  return [history[index], setState, undo, redo, reset]
}

const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q'],
  )

  d.push('Z')
  return d.join(' ')
}

const drawElement = (roughCanvas, context, element) => {
  switch (element.type) {
    case 'line':
    case 'rectangle':
      context.strokeStyle = 'red'
      roughCanvas.draw(element.roughElement)
      break
    case 'pencil':
      context.fillStyle = element.options.color
      const stroke = getSvgPathFromStroke(getStroke(element.points, { size: 3 }))
      context.fill(new Path2D(stroke))
      break
    case 'text':
      context.textBaseline = 'top'
      context.font = '16px sans-serif'
      context.fillText(element.text, element.x1, element.y1)
      break
    default:
      throw new Error(`Type not recognised: ${element.type}`)
  }
}

const adjustmentRequired = (type) => ['line', 'rectangle'].includes(type)

export {
  createElement,
  getElementAtPosition,
  adjustElementCoordinates,
  cursorForPosition,
  resizedCoordinates,
  useHistory,
  drawElement,
  adjustmentRequired,
}
