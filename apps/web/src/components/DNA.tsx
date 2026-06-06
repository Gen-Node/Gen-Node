import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

/* ---------- procedural fallback (used while loading / on error) ---------- */

const PAIRS = 20
const RADIUS = 1.5
const VSTEP = 0.45
const ASTEP = 0.5

type NodeDef = { pos: [number, number, number]; strand: 0 | 1 }
type RungDef = { pos: [number, number, number]; quat: [number, number, number, number]; len: number }

function Helix() {
  const { nodes, rungs } = useMemo(() => {
    const nodes: NodeDef[] = []
    const rungs: RungDef[] = []
    const up = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < PAIRS; i++) {
      const y = (i - PAIRS / 2) * VSTEP
      const angle = i * ASTEP
      const a = new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS)
      const b = new THREE.Vector3(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS)
      nodes.push({ pos: [a.x, a.y, a.z], strand: 0 })
      nodes.push({ pos: [b.x, b.y, b.z], strand: 1 })
      const mid = a.clone().add(b).multiplyScalar(0.5)
      const dir = b.clone().sub(a).normalize()
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir)
      rungs.push({ pos: [mid.x, mid.y, mid.z], quat: [q.x, q.y, q.z, q.w], len: a.distanceTo(b) })
    }
    return { nodes, rungs }
  }, [])

  return (
    <group rotation={[0, 0, 0.12]}>
      {nodes.map((n, i) => (
        <mesh key={`n${i}`} position={n.pos}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial
            color={n.strand === 0 ? '#22d3ee' : '#818cf8'}
            emissive={n.strand === 0 ? '#0891b2' : '#4f46e5'}
            emissiveIntensity={0.95}
            roughness={0.25}
            metalness={0.35}
          />
        </mesh>
      ))}
      {rungs.map((r, i) => (
        <mesh key={`r${i}`} position={r.pos} quaternion={r.quat}>
          <cylinderGeometry args={[0.035, 0.035, r.len, 8]} />
          <meshStandardMaterial color="#cde8f5" emissive="#155e75" emissiveIntensity={0.4} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- real GLB model ---------- */

function GLBModel({ url, fit = 6, tint }: { url: string; fit?: number; tint?: string }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder)
  })
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
            std.emissiveIntensity = 0.35
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

/* ---------- rotation + error boundary ---------- */

function Spinner({ children, speed = 0.3, tilt = 0.12 }: { children: ReactNode; speed?: number; tilt?: number }) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, d) => {
    if (g.current) g.current.rotation.y += d * speed
  })
  return (
    <group ref={g} rotation={[tilt, 0, 0]}>
      {children}
    </group>
  )
}

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function DNA({ src = '/models/dna.glb', tint = '#22d3ee' }: { src?: string; tint?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[6, 6, 6]} intensity={160} color="#38bdf8" />
      <pointLight position={[-6, -4, 2]} intensity={110} color="#818cf8" />
      <pointLight position={[0, 0, 6]} intensity={60} color="#ffffff" />
      <Spinner>
        <Boundary fallback={<Helix />}>
          <Suspense fallback={<Helix />}>
            <GLBModel url={src} tint={tint} />
          </Suspense>
        </Boundary>
      </Spinner>
    </Canvas>
  )
}
