'use client'

import dynamic from 'next/dynamic'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { WebMcpProvider } from '@/components/WebMcpProvider'

const CursorFollower = dynamic(
  () => import('@/components/motion/CursorFollower').then((m) => ({ default: m.CursorFollower })),
  { ssr: false }
)
const GrainOverlay = dynamic(
  () => import('@/components/ui/GrainOverlay').then((m) => ({ default: m.GrainOverlay })),
  { ssr: false }
)
const DiscordModal = dynamic(
  () => import('@/components/DiscordModal').then((m) => ({ default: m.DiscordModal })),
  { ssr: false }
)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      {children}
      <WebMcpProvider />
      <DiscordModal />
      <CursorFollower />
      <GrainOverlay />
    </MotionProvider>
  )
}
