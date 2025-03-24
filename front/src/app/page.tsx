"use client"
import ModelViewer from '@/components/ModelViewer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      {/* <h1 className="text-3xl font-bold my-4">Solo Leveling 3D Model</h1> */}
      <ModelViewer />
    </main>
  )
}