import { useRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, useProgress } from '@react-three/drei'
import { Group } from 'three'

useGLTF.preload('/3d-models/solo_leveling_aut.glb')

function Model() {
  const modelRef = useRef<Group>(null)
  const { scene } = useGLTF('/3d-models/solo_leveling_aut.glb')
  
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.PI * -0.5;
    }
  }, [])
  
  return <primitive ref={modelRef} object={scene} scale={1} position={[0, 0, 0]} />
}

function Loader() {
  const { progress } = useProgress()
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-lg font-medium">{progress.toFixed(0)}% loaded</p>
    </div>
  )
}


export default function ModelViewer() {
  return (
    <div className="w-full h-screen relative">
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src="/videos/background.mp4"
      />
      
      <div className="w-full h-full relative z-10">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ alpha: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <Model />
          </Suspense>
          <OrbitControls />
        </Canvas>
        <Suspense fallback={<Loader />} />
      </div>
    </div>
  )
}