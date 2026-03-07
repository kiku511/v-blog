import { useState, useRef, useEffect } from 'react'

type Options = {
  initial:    number
  min:        number
  max:        number
  axis?:      'x' | 'y'
  direction?: 1 | -1   // 1 = grow when dragging in positive axis direction, -1 = opposite
}

export function useDragResize({ initial, min, max, axis = 'x', direction = 1 }: Options) {
  const [size, setSize] = useState(initial)
  const drag = useRef({ active: false, startPos: 0, startSize: initial })

  const onDragStart = (e: React.MouseEvent) => {
    drag.current = { active: true, startPos: axis === 'x' ? e.clientX : e.clientY, startSize: size }
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current.active) return
      const pos   = axis === 'x' ? e.clientX : e.clientY
      const delta = (pos - drag.current.startPos) * direction
      setSize(Math.min(max, Math.max(min, drag.current.startSize + delta)))
    }
    const onUp = () => { drag.current.active = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [axis, direction, min, max])

  return [size, onDragStart] as const
}
