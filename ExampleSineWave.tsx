import React, { FC } from 'react'
import Canvas from './Canvas'

export const ExampleSineWave: FC = () => {
  const canvasWidth = 500
  const canvasHeight = 200
  const yAxis = height / 2
  const xStep = 5
  const amplitude = 10
  const frequency = 50
  return (
    <Canvas
      width={canvasWidth}
      height={canvasHeight}
      setup={ctx => {
        ctx.strokeStyle = '#000'
      }}
      render={(ctx, _deltaTime, time) => {
        let x = 0
        let y = 0
        const timeOff = time * 0.05
        ctx.beginPath()
        ctx.moveTo(0, yAxis)
        while (x < width) {
          y = yAxis + amplitude * Math.sin((x + timeOff) / frequency)
          ctx.lineTo(x, y)
          x = x + xStep
        }
        ctx.stroke()
      }}
    />
  )
}
