'use client'

import { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  isDarkMode: boolean
}

export default function AnimatedBackground({ isDarkMode }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // TypeScript keeps a narrowed const inside arrow closures but not inside a
    // class body, so the class reads these explicitly typed aliases instead.
    const surface: HTMLCanvasElement = canvas
    const context: CanvasRenderingContext2D = ctx

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      pulseSpeed: number
      pulsePhase: number

      constructor() {
        this.x = Math.random() * surface.width
        this.y = Math.random() * surface.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.3 + 0.1
        this.pulseSpeed = Math.random() * 0.02 + 0.01
        this.pulsePhase = Math.random() * Math.PI * 2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > surface.width) this.x = 0
        if (this.x < 0) this.x = surface.width
        if (this.y > surface.height) this.y = 0
        if (this.y < 0) this.y = surface.height

        this.pulsePhase += this.pulseSpeed
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7
        const currentOpacity = this.opacity * pulse

        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fillStyle = isDarkMode
          ? `rgba(255, 255, 255, ${currentOpacity})`
          : `rgba(0, 0, 0, ${currentOpacity})`
        context.fill()
      }
    }

    const init = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const connectParticles = () => {
      const maxDistance = 150
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15
            ctx.beginPath()
            ctx.strokeStyle = isDarkMode
              ? `rgba(255, 255, 255, ${opacity})`
              : `rgba(0, 0, 0, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      connectParticles()

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    init()
    animate()

    const onResize = () => {
      resizeCanvas()
      init()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', onResize)
    }
  }, [isDarkMode])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
