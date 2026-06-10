import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

function IntroLogo() {
  const gltf = useLoader(GLTFLoader, '/models/logo3d.glb', (l) => l.setMeshoptDecoder(MeshoptDecoder))
  const group = useRef<THREE.Group>(null)
  const start = useRef<number | null>(null)

  const scene = useMemo(() => {
    const s = gltf.scene.clone(true)
    const c = new THREE.Color('#22d3ee')
    s.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      mats.forEach((raw) => {
        const std = raw as THREE.MeshStandardMaterial
        if (std && (std as unknown as { isMeshStandardMaterial?: boolean }).isMeshStandardMaterial) {
          std.emissive = c
          std.emissiveIntensity = 0.5
          std.needsUpdate = true
        }
      })
    })
    const box = new THREE.Box3().setFromObject(s)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = 5 / maxDim
    s.scale.setScalar(scale)
    s.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    return s
  }, [gltf])

  useFrame((state) => {
    const g = group.current
    if (!g) return
    if (start.current === null) start.current = state.clock.elapsedTime
    const t = state.clock.elapsedTime - start.current
    const k = Math.min(1, t / 1.1)
    const ease = 1 - Math.pow(1 - k, 3)
    g.scale.setScalar(0.15 + 0.85 * ease)
    g.rotation.y = t * 0.9
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const fade = setTimeout(() => setHide(true), 3200)
    const done = setTimeout(onDone, 3900)
    return () => {
      clearTimeout(fade)
      clearTimeout(done)
    }
  }, [onDone])

  const skip = () => {
    setHide(true)
    setTimeout(onDone, 600)
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-opacity duration-700 ${
        hide ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <button onClick={skip} className="absolute right-5 top-5 text-xs tracking-widest text-white/40 transition hover:text-white">
        SKIP →
      </button>

      <div className="h-[46vh] w-full max-w-lg">
        <Canvas camera={{ position: [0, 0, 11], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[6, 6, 6]} intensity={170} color="#38bdf8" />
          <pointLight position={[-6, -4, 2]} intensity={120} color="#818cf8" />
          <pointLight position={[0, 0, 6]} intensity={60} color="#ffffff" />
          <Suspense fallback={null}>
            <IntroLogo />
          </Suspense>
        </Canvas>
      </div>

      <div className="-mt-2 text-center">
        <div className="font-chalk text-6xl text-bluex glow-text fade-up md:text-7xl">Gennode</div>
        <div className="mt-1 text-sm tracking-[0.3em] text-white/55 fade-up">DECENTRALIZED BIO-COMPUTE</div>
      </div>
    </div>
  )
}
