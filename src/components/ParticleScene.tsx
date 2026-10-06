import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, Color, InstancedMesh, MathUtils, Object3D, Vector3 } from 'three'
import { frame } from '../state/store'

/*
 * The demo page's 3D background, in its own module so three.js (the biggest download on
 * the site) is fetched only once Stage in App.tsx has decided to animate it.
 */

function SceneParticles() {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const color = useMemo(() => new Color(), [])
  const points = useMemo(() => {
    const out: Array<{ base: Vector3; phase: number; size: number; tint: number }> = []
    for (let i = 0; i < 760; i++) {
      const ring = Math.sqrt(Math.random()) * 7.2
      const theta = Math.random() * Math.PI * 2
      out.push({
        base: new Vector3(Math.cos(theta) * ring, (Math.random() - 0.5) * 5.2, Math.sin(theta) * ring),
        phase: Math.random() * Math.PI * 2,
        size: MathUtils.randFloat(0.018, 0.072),
        tint: Math.random(),
      })
    }
    return out
  }, [])

  useEffect(() => {
    if (!mesh.current) return
    points.forEach((point, i) => {
      color.setHSL(0.45 + point.tint * 0.2, 0.72, 0.58)
      mesh.current!.setColorAt(i, color)
    })
    mesh.current.instanceColor!.needsUpdate = true
  }, [color, points])

  useFrame(({ clock, camera }) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    const cx = (frame.cursorX - 0.5) * 8
    const cy = (0.5 - frame.cursorY) * 5
    const strength = frame.cursorStrength
    const pinch = frame.cursorPinch
    const scroll = frame.scroll / Math.max(frame.maxScroll, 1)
    const zoom = frame.zoom

    camera.position.x = MathUtils.lerp(camera.position.x, (frame.cursorX - 0.5) * 1.1 * strength, 0.05)
    camera.position.y = MathUtils.lerp(camera.position.y, (0.5 - frame.cursorY) * 0.7 * strength, 0.05)
    camera.position.z = MathUtils.lerp(camera.position.z, 8.2 / zoom, 0.04)
    camera.lookAt(0, 0, 0)

    points.forEach((point, i) => {
      const wave = Math.sin(t * 0.55 + point.phase + scroll * 5)
      const x = point.base.x + Math.sin(t * 0.23 + point.phase) * 0.22
      const y = point.base.y + wave * 0.18
      const z = point.base.z + Math.cos(t * 0.31 + point.phase) * 0.35 + scroll * 2.6
      const dx = x - cx
      const dy = y - cy
      const dist = Math.max(Math.hypot(dx, dy), 0.001)
      const repel = strength * (0.55 + pinch * 1.3) / (dist * dist + 0.25)

      dummy.position.set(x + (dx / dist) * repel, y + (dy / dist) * repel, z)
      dummy.rotation.set(t * 0.12 + point.phase, t * 0.2, point.phase)
      dummy.scale.setScalar(point.size * (1 + strength * 1.6 + pinch * 1.2))
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, points.length]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial transparent opacity={0.68} blending={AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  )
}

export default function ParticleScene() {
  return (
    <Canvas className="stage" camera={{ position: [0, 0, 8.2], fov: 46 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#05060a']} />
      <SceneParticles />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.72} luminanceThreshold={0.08} luminanceSmoothing={0.8} mipmapBlur />
        <Vignette offset={0.18} darkness={0.64} />
      </EffectComposer>
    </Canvas>
  )
}
