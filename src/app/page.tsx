'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw } from "lucide-react"

// Shadcn UI components
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export default function Component() {
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [inputMinutes, setInputMinutes] = useState('25')

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTime(parseInt(inputMinutes) * 60)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMinutes(e.target.value)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((parseInt(inputMinutes) * 60 - time) / (parseInt(inputMinutes) * 60)) * 100

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Focus Timer</h2>
        <div className="flex flex-col items-center space-y-6">
          <div className="w-48 h-48 rounded-full border-8 border-gray-200 flex items-center justify-center relative">
            <div 
              className="absolute inset-0 rounded-full border-8 border-blue-500"
              style={{
                clipPath: `inset(0 0 ${100 - progress}% 0)`,
              }}
            />
            <span className="text-4xl font-bold">{formatTime(time)}</span>
          </div>
          <div className="flex space-x-4">
            <Button onClick={toggleTimer}>
              {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer} className="bg-gray-500 hover:bg-gray-600">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={inputMinutes}
              onChange={handleInputChange}
              className="w-20"
              min="1"
            />
            <span>minutes</span>
          </div>
        </div>
      </div>
    </div>
  )
}