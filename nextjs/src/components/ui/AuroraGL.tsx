'use client'

import { useEffect, useRef } from 'react'

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m = max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m = m*m; m = m*m;
  vec3 x2 = 2.0*fract(p*C.www)-1.0;
  vec3 h = abs(x2)-0.5;
  vec3 ox = floor(x2+0.5);
  vec3 a0 = x2-ox;
  m *= 1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x  = a0.x*x0.x+h.x*x0.y;
  g.yz = a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  vec3 c0 = uColorStops[0], c1 = uColorStops[1], c2 = uColorStops[2];
  vec3 rampColor;
  if (uv.x < 0.5) {
    rampColor = mix(c0, c1, uv.x * 2.0);
  } else {
    rampColor = mix(c1, c2, (uv.x - 0.5) * 2.0);
  }
  
  float height = snoise(vec2(uv.x*2.0+uTime*0.1, uTime*0.25))*0.5*uAmplitude;
  height = exp(height);
  height = (uv.y*2.0 - height + 0.2);
  float intensity = 0.6*height;
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend*0.5, midPoint + uBlend*0.5, intensity);
  vec3 auroraColor = intensity * rampColor;
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}`

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) / 255
  const g = parseInt(clean.substring(2, 4), 16) / 255
  const b = parseInt(clean.substring(4, 6), 16) / 255
  return [r, g, b]
}

interface AuroraGLProps {
  colorStops?: string[]
  amplitude?: number
  blend?: number
  speed?: number
  className?: string
  style?: React.CSSProperties
}

export function AuroraGL({
  colorStops = ['#100a04', '#c9a84c', '#8b4a2a'],
  amplitude = 1.3,
  blend = 0.55,
  speed = 0.5,
  className,
  style,
}: AuroraGLProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef({ colorStops, amplitude, blend, speed })
  propsRef.current = { colorStops, amplitude, blend, speed }

  useEffect(() => {
    const ctn = containerRef.current
    if (!ctn) return

    let animId = 0
    let gl: WebGL2RenderingContext | null = null
    let canvas: HTMLCanvasElement | null = null

    try {
      canvas = document.createElement('canvas')
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
      gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false })
      if (!gl) throw new Error('No WebGL2')

      ctn.appendChild(canvas)

      const ctx = gl

      function compileShader(type: number, src: string) {
        const s = ctx.createShader(type)!
        ctx.shaderSource(s, src)
        ctx.compileShader(s)
        return s
      }

      const vs = compileShader(ctx.VERTEX_SHADER, VERT)
      const fs = compileShader(ctx.FRAGMENT_SHADER, FRAG)
      const program = ctx.createProgram()!
      ctx.attachShader(program, vs)
      ctx.attachShader(program, fs)
      ctx.linkProgram(program)
      ctx.useProgram(program)

      // Full-screen triangle
      const verts = new Float32Array([-1, -1, 3, -1, -1, 3])
      const buf = ctx.createBuffer()
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buf)
      ctx.bufferData(ctx.ARRAY_BUFFER, verts, ctx.STATIC_DRAW)
      const posLoc = ctx.getAttribLocation(program, 'position')
      ctx.enableVertexAttribArray(posLoc)
      ctx.vertexAttribPointer(posLoc, 2, ctx.FLOAT, false, 0, 0)

      const uTime = ctx.getUniformLocation(program, 'uTime')
      const uAmp = ctx.getUniformLocation(program, 'uAmplitude')
      const uStops = ctx.getUniformLocation(program, 'uColorStops')
      const uRes = ctx.getUniformLocation(program, 'uResolution')
      const uBlendU = ctx.getUniformLocation(program, 'uBlend')

      ctx.enable(ctx.BLEND)
      ctx.blendFunc(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA)
      ctx.clearColor(0, 0, 0, 0)

      function resize() {
        if (!ctn || !canvas || !gl) return
        const w = ctn.offsetWidth, h = ctn.offsetHeight
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
        gl.uniform2f(uRes, w, h)
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(ctn)

      const update = (t: number) => {
        animId = requestAnimationFrame(update)
        const p = propsRef.current
        const stops = p.colorStops.map(hexToRgb)
        ctx.uniform1f(uTime, t * 0.001 * p.speed)
        ctx.uniform1f(uAmp, p.amplitude)
        ctx.uniform3fv(uStops, stops.flat())
        ctx.uniform1f(uBlendU, p.blend)
        ctx.clear(ctx.COLOR_BUFFER_BIT)
        ctx.drawArrays(ctx.TRIANGLES, 0, 3)
      }
      animId = requestAnimationFrame(update)

      return () => {
        cancelAnimationFrame(animId)
        ro.disconnect()
        if (canvas && ctn.contains(canvas)) ctn.removeChild(canvas)
        gl?.getExtension('WEBGL_lose_context')?.loseContext()
      }
    } catch {
      // Fallback: CSS aurora already in globals.css
      return
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}
      aria-hidden="true"
    />
  )
}
