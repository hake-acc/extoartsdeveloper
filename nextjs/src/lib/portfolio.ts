import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { unstable_cache } from 'next/cache'
import type { GalleryImage } from '@/app/portfolio/PortfolioClient'

const ALLOWED_EXT = /\.(jpg|jpeg|png|webp|gif|avif)$/i

// Only ever load locally-uploaded "All Artists Samples" — legacy CDN links
// (old iili.io game-category thumbnails) must never be surfaced in the portfolio.
async function readFolder(sub: string): Promise<GalleryImage[]> {
  const dir = path.join(process.cwd(), 'public', 'portfolio', sub)
  if (!existsSync(dir)) return []
  const entries = await fs.readdir(dir)
  const filtered = entries.filter((f) => ALLOWED_EXT.test(f))
  // Stat all files in parallel — eliminates the N+1 syscall pattern
  const withMtime = await Promise.all(
    filtered.map(async (f) => ({
      file: f,
      mtime: (await fs.stat(path.join(dir, f))).mtimeMs,
    }))
  )
  return withMtime
    .sort((a, b) => b.mtime - a.mtime)
    .map(({ file }) => ({
      src: `/portfolio/${sub}/${file}`,
      alt: sub === 'Logos' ? 'ExtoArts logo design' : sub === 'Banners' ? 'ExtoArts channel banner' : 'ExtoArts portfolio work',
      width: sub === 'Banners' ? 2560 : sub === 'Logos' ? 800 : 1280,
      height: sub === 'Banners' ? 1440 : sub === 'Logos' ? 800 : 720,
    }))
}

// Cached at the Next.js data-cache layer — filesystem reads only happen once
// per deployment (or when manually revalidated). Subsequent requests within the
// same server process are served from memory, eliminating FS stat overhead and
// keeping TTFB low. revalidate: 3600 ensures stale data is refreshed hourly so
// newly uploaded portfolio images surface within an hour without a redeploy.
const _getPortfolioData = unstable_cache(
  async () => {
    const [thumbnails, logos, banners] = await Promise.all([
      readFolder('Thumbnails'),
      readFolder('Logos'),
      readFolder('Banners'),
    ])
    return { thumbnails, logos, banners }
  },
  ['portfolio-data'],
  { revalidate: 3600, tags: ['portfolio'] }
)

export async function getPortfolioData() {
  return _getPortfolioData()
}
