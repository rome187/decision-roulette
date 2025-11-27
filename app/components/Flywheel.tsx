'use client'

import { useState, useRef } from 'react'

const COLORS = [
  { from: '#ec4899', to: '#f43f5e' }, // pink-500 to rose-500
  { from: '#a855f7', to: '#6366f1' }, // purple-500 to indigo-500
  { from: '#3b82f6', to: '#06b6d4' }, // blue-500 to cyan-500
  { from: '#22c55e', to: '#10b981' }, // green-500 to emerald-500
  { from: '#eab308', to: '#f97316' }, // yellow-500 to orange-500
]

export default function Flywheel() {
  const [options, setOptions] = useState<string[]>(['', '', '', '', ''])
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  const filledOptions = options.filter(opt => opt.trim() !== '')
  const canSpin = filledOptions.length > 0 && !isSpinning

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    setSelectedIndex(null)
  }

  const spin = () => {
    if (!canSpin) return

    setIsSpinning(true)
    setSelectedIndex(null)

    // Calculate random rotation
    const fullRotations = Math.floor(5 + Math.random() * 5) // 5-10 full integer rotations
    const segmentAngle = 360 / filledOptions.length
    const randomSegment = Math.floor(Math.random() * filledOptions.length)
    
    // Calculate the offset for the selected segment center relative to the start (Top)
    // Segment 0 is at Top.
    // Center of Segment i is at: i * segmentAngle + segmentAngle / 2 (clockwise from Top)
    const nextOffset = randomSegment * segmentAngle + segmentAngle / 2

    // Calculate current offset (what is currently at the top)
    // rotation is negative (CCW). Math.abs(rotation % 360) gives the positive angle 
    // on the wheel that is currently aligned with the Top.
    const currentOffset = Math.abs(rotation % 360)
    
    // We want to rotate from currentOffset to nextOffset.
    // Since we only rotate CCW (negative), we calculate the difference.
    // diff = current - next.
    // If diff is negative (e.g. 0 -> 60 = -60), we rotate -60.
    // If diff is positive (e.g. 90 -> 60 = 30), we need to wrap around: 30 - 360 = -330.
    let diff = currentOffset - nextOffset
    if (diff > 0) {
      diff -= 360
    }
    
    // Log for debugging
    console.log({
      filledOptions: filledOptions.length,
      randomSegment,
      segmentAngle,
      currentRotation: rotation,
      currentOffset,
      nextOffset,
      diff,
      fullRotations,
      totalRotation: rotation + -(fullRotations * 360) + diff
    })
    
    const totalRotation = rotation + -(fullRotations * 360) + diff
    
    setRotation(totalRotation)

    // Wait for animation to complete (adjust timing to match CSS animation)
    setTimeout(() => {
      setIsSpinning(false)
      setSelectedIndex(randomSegment)
    }, 4000) // 4 seconds for smooth animation
  }

  const reset = () => {
    setOptions(['', '', '', '', ''])
    setSelectedIndex(null)
    setRotation(0)
    setIsSpinning(false)
  }

  const renderWheel = () => {
    const segments = filledOptions.length
    const segmentAngle = 360 / segments
    const radius = 200
    const centerX = 250
    const centerY = 250

    return (
      <svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        className="drop-shadow-2xl"
      >
        <defs>
          {COLORS.slice(0, segments).map((color, i) => (
            <linearGradient key={i} id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color.from} />
              <stop offset="100%" stopColor={color.to} />
            </linearGradient>
          ))}
        </defs>
        
        {/* Wheel segments */}
        {Array.from({ length: segments }).map((_, i) => {
          const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
          const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)
          
          const x1 = centerX + radius * Math.cos(startAngle)
          const y1 = centerY + radius * Math.sin(startAngle)
          const x2 = centerX + radius * Math.cos(endAngle)
          const y2 = centerY + radius * Math.sin(endAngle)
          
          const largeArcFlag = segmentAngle > 180 ? 1 : 0
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ')

          // Text position (middle of segment)
          const textAngle = (i * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180)
          const textRadius = radius * 0.7
          const textX = centerX + textRadius * Math.cos(textAngle)
          const textY = centerY + textRadius * Math.sin(textAngle)

          return (
            <g key={i}>
              <path
                d={pathData}
                fill={`url(#gradient-${i})`}
                stroke="white"
                strokeWidth="3"
                className="transition-opacity duration-300"
                style={{
                  opacity: selectedIndex === i ? 1 : 0.9
                }}
              />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-4xl font-bold text-white drop-shadow-lg"
                fill="white"
              >
                {i + 1}
              </text>
            </g>
          )
        })}
        
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r="30"
          fill="white"
          stroke="gray-300"
          strokeWidth="3"
          className="drop-shadow-lg"
        />
      </svg>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Input Fields */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Enter Your Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Option {i + 1}
              </label>
              <input
                type="text"
                value={options[i]}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                placeholder={`Enter option ${i + 1}`}
                disabled={isSpinning}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Wheel Container */}
      <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl shadow-2xl p-8">
        {filledOptions.length === 0 ? (
          /* Empty State Message */
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-gray-600 font-medium">Add options to create the wheel</p>
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            {/* Pointer */}
            <div className="absolute top-0 z-10 transform -translate-y-2">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg"></div>
            </div>
            
            {/* Wheel */}
            <div
              ref={wheelRef}
              className="transition-transform duration-[4000ms] ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {renderWheel()}
            </div>
          </div>
        )}

        {/* Spin Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={spin}
            disabled={!canSpin}
            className={`
              px-12 py-4 text-xl font-bold rounded-full shadow-lg transform transition-all duration-200
              ${canSpin
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </button>
        </div>

        {/* Reset Button */}
        {filledOptions.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={reset}
              disabled={isSpinning}
              className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reset Options
            </button>
          </div>
        )}
      </div>

      {/* Result Display */}
      {selectedIndex !== null && (
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl shadow-2xl p-8 animate-pulse">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-white mb-4">
              🎉 Congratulations, we have arrived at a decision! 🎉
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-2xl font-semibold text-gray-900">
                {filledOptions[selectedIndex]}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Option {selectedIndex + 1} was selected!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

