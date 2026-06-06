import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

function Loaded({ url, fit, tint }: { url: string; fit: number; tint?: string }) {
  const gltf = useLoader(GLTFLoader, url, (l) => l.setMeshoptDecoder(MeshoptDecoder))
  const scene = useMemo(() => {
    const s = gltf.scene.clone(true)
    if (tint) {
      const c = new THREE.Color(tint)
      s.traverse((o) => {
        const m = o as THREE.Mesh
        if (!m.isMesh) return
        const mats = Array.isArray(m.material) ? m.material : [m.material]
        mats.forEach((raw) => {
          const std = raw as THREE.MeshStandardMaterial
          if (std && (std as unknown as { isMeshStandardMaterial?: boolean }).isMeshStandardMaterial) {
            std.emissive = c
            std.emissiveIntensity = 0.4
            std.needsUpdate = true
          }
        })
      })
    }
    const box = new THREE.Box3().setFromObject(s)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = fit / maxDim
    s.scale.setScalar(scale)
    s.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    return s
  }, [gltf, fit, tint])
  return <primitive object={scene} />
}

function Spin({ children, speed = 0.5 }: { children: ReactNode; speed?: number }) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, d) => {
    if (g.current) g.current.rotation.y += d * speed
  })
  return (
    <group ref={g} rotation={[0.18, 0, 0]}>
      {children}
    </group>
  )
}

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Model3D({
  src,
  tint = '#22d3ee',
  fit = 5,
  speed = 0.5,
  className,
}: {
  src: string
  tint?: string
  fit?: number
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Toggle mount with viewport: frees the WebGL context when scrolled away,
    // so many models on one page never exceed the browser's context limit.
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '250px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}>
      {inView && (
        <Canvas
          camera={{ position: [0, 0, 9], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.75} />
          <pointLight position={[5, 5, 6]} intensity={120} color="#38bdf8" />
          <pointLight position={[-5, -3, 2]} intensity={90} color="#818cf8" />
          <Boundary>
            <Suspense fallback={null}>
              <Spin speed={speed}>
                <Loaded url={src} fit={fit} tint={tint} />
              </Spin>
            </Suspense>
          </Boundary>
        </Canvas>
      )}
    </div>
  )
}
