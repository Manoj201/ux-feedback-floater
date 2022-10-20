/* eslint-disable no-case-declarations */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
// @ts-ignore: Unreachable code error
import rough from 'roughjs/bundled/rough.esm'
import * as htmlToImage from 'html-to-image'

import './Canvas.css'

import {
  Create as CreateIcon,
  CropSquare as CropSquareIcon,
  Comment as CommentIcon,
  Redo as RedoIcon,
  Undo as UndoIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  PanTool as PanToolIcon,
} from '@mui/icons-material'

import ToolButton from '../toolButton/ToolButton'
import {
  createElement,
  getElementAtPosition,
  adjustElementCoordinates,
  cursorForPosition,
  resizedCoordinates,
  useHistory,
  drawElement,
  adjustmentRequired,
} from './DrawingHelper'

const generator = rough.generator()

const Canvas = ({ onClickSave, onClickCancel }: any) => {
  const [elements, setElements, undo, redo, reset] = useHistory([])
  const [action, setAction] = useState('none')
  const [selectedElement, setSelectedElement] = useState<any>(null)
  const [tool, setTool] = useState('pencil')
  const color = 'red'
  const textAreaRef = useRef<any>()

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const canvas: any = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)

    const roughCanvas = rough.canvas(canvas)

    elements.forEach((element: any) => {
      if (action === 'writing' && selectedElement?.id === element.id) return
      drawElement(roughCanvas, context, element)
    })
  }, [elements, action, selectedElement])

  useEffect(() => {
    const undoRedoFunction = (event: any) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
    }

    document.addEventListener('keydown', undoRedoFunction)
    return () => {
      document.removeEventListener('keydown', undoRedoFunction)
    }
  }, [undo, redo])

  useEffect(() => {
    const textArea: any = textAreaRef.current
    if (action === 'writing' && textArea) {
      // textArea.focus();
      textArea.value = selectedElement.text
    }
  }, [action, selectedElement])

  const updateElement = (
    id: any,
    x1: number,
    y1: number | null,
    x2: number | null,
    y2: number | null,
    type: string,
    options: any,
  ) => {
    const elementsCopy: Array<any> = [...elements]

    switch (type) {
      case 'line':
      case 'rectangle':
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, options, generator)
        break
      case 'pencil':
        elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }]
        break
      case 'text':
        const canvasEl: any = document.getElementById('canvas')
        const textWidth: any = canvasEl?.getContext('2d').measureText(options.text).width
        const textHeight = 24
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 ? y1 + textHeight : textHeight, type, options, generator),
          text: options.text,
        }
        break
      default:
        throw new Error(`Type not recognised: ${type}`)
    }

    setElements(elementsCopy, true)
  }

  const handleMouseDown = (event: any) => {
    if (action === 'writing') return

    const { clientX, clientY } = event
    if (tool === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements)
      if (element) {
        if (element.type === 'pencil') {
          const xOffsets = element.points.map((point: any) => clientX - point.x)
          const yOffsets = element.points.map((point: any) => clientY - point.y)
          setSelectedElement({ ...element, xOffsets, yOffsets })
        } else {
          const offsetX = clientX - element.x1
          const offsetY = clientY - element.y1
          setSelectedElement({ ...element, offsetX, offsetY })
        }
        setElements((prevState: any) => prevState)

        if (element.position === 'inside') {
          setAction('moving')
        } else {
          setAction('resizing')
        }
      }
    } else {
      const id = elements.length
      const element = createElement(id, clientX, clientY, clientX, clientY, tool, { color }, generator)
      setElements((prevState: any) => [...prevState, element])
      setSelectedElement(element)

      setAction(tool === 'text' ? 'writing' : 'drawing')
    }
  }

  const handleMouseMove = (event: any) => {
    const { clientX, clientY } = event

    if (tool === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements)
      event.target.style.cursor = element ? cursorForPosition(element.position) : 'default'
    }

    if (action === 'drawing') {
      const index = elements.length - 1
      const { x1, y1, options } = elements[index]
      updateElement(index, x1, y1, clientX, clientY, tool, options)
    } else if (action === 'moving') {
      if (selectedElement.type === 'pencil') {
        const newPoints = selectedElement.points.map((_: any, index: number) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }))
        const elementsCopy = [...elements]
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        }
        setElements(elementsCopy, true)
      } else {
        const { id, x1, x2, y1, y2, options: colorOptions, type, offsetX, offsetY } = selectedElement
        const width = x2 - x1
        const height = y2 - y1
        const newX1 = clientX - offsetX
        const newY1 = clientY - offsetY
        const options = type === 'text' ? { text: selectedElement.text } : {}
        updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, {
          ...options,
          ...colorOptions,
        })
      }
    } else if (action === 'resizing') {
      const { id, type, options, position, ...coordinates } = selectedElement
      const { x1, y1, x2, y2 }: any = resizedCoordinates(clientX, clientY, position, coordinates)
      updateElement(id, x1, y1, x2, y2, type, options)
    }
  }

  const handleMouseUp = (event: any) => {
    const { clientX, clientY } = event
    if (selectedElement) {
      if (
        selectedElement.type === 'text' &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction('writing')
        return
      }

      const index = selectedElement.id
      const { id, type, options } = elements[index]
      if ((action === 'drawing' || action === 'resizing') && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index])
        updateElement(id, x1, y1, x2, y2, type, options)
      }
    }

    if (action === 'writing') return

    setAction('none')
    setSelectedElement(null)
  }

  const handleBlur = (event: any) => {
    const { id, x1, y1, type } = selectedElement
    setAction('none')
    setSelectedElement(null)
    updateElement(id, x1, y1, null, null, type, { text: event.target.value })
  }

  const handleCaptureScree = () => {
    const node: any = document.getElementById('root')
    htmlToImage
      .toPng(node)
      .then(function (dataUrl) {
        onClickSave(dataUrl)
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  return (
    <div className='canvas-container'>
      <div className='canvas-tool-panel'>
        <ToolButton onclickTool={() => setTool('pencil')} icon={CreateIcon} isActive={tool === 'pencil'} />
        <ToolButton onclickTool={() => setTool('rectangle')} icon={CropSquareIcon} isActive={tool === 'rectangle'} />
        <ToolButton onclickTool={() => setTool('text')} icon={CommentIcon} isActive={tool === 'text'} />
        <ToolButton onclickTool={() => setTool('selection')} icon={PanToolIcon} isActive={tool === 'selection'} />
        <ToolButton onclickTool={undo} icon={UndoIcon} isActive={false} />
        <ToolButton onclickTool={redo} icon={RedoIcon} isActive={false} />
        <ToolButton onclickTool={handleCaptureScree} icon={SaveIcon} isActive={false} />
        <ToolButton
          onclickTool={() => {
            onClickCancel()
            reset()
          }}
          icon={CloseIcon}
          isActive={false}
        />
      </div>

      {action === 'writing' ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          autoFocus={true}
          placeholder='Enter your feedback'
          className='canvas-comment-area'
          style={{
            top: selectedElement.y1 - 2,
            left: selectedElement.x1,
          }}
        />
      ) : null}
      <canvas
        id='canvas'
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className='canvas'
      >
        Canvas
      </canvas>
    </div>
  )
}

export default Canvas
