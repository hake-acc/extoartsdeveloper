import fs from 'fs'
import path from 'path'
import type { GalleryImage } from '@/app/portfolio/PortfolioClient'

const ALLOWED_EXT = /\.(jpg|jpeg|png|webp|gif|avif)$/i

// Only ever load locally-uploaded "All Artists Samples" — legacy CDN links
// (old iili.io game-category thumbnails) must never be surfaced in the portfolio.
function readFolder(sub: string): GalleryImage[] {
  const dir = path.join(process.cwd(), 'public', 'portfolio', sub)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => ALLOWED_EXT.test(f))
    .map((f) => ({
      file: f,
      mtime: fs.statSync(path.join(dir, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime)
    .map(({ file }) => ({
      src: `/portfolio/${sub}/${file}`,
      alt: sub === 'Logos' ? 'ExtoArts logo design' : sub === 'Banners' ? 'ExtoArts channel banner' : 'ExtoArts portfolio work',
      width: sub === 'Banners' ? 2560 : sub === 'Logos' ? 800 : 1280,
      height: sub === 'Banners' ? 1440 : sub === 'Logos' ? 800 : 720,
    }))
}

export async function getPortfolioData() {
  return {
    thumbnails: readFolder('Thumbnails'),
    logos: readFolder('Logos'),
    banners: readFolder('Banners'),
  }
}
