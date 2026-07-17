/**
 * Computes a short content hash of public/css/deferred.css at module load time.
 * The result is cached by Node's module system, so it's computed once per process.
 *
 * Used by layout.tsx to generate a stable cache-busting query param
 * (?v=<hash>) that updates automatically whenever deferred.css changes —
 * no manual version bump required.
 */
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'

function computeVersion(): string {
  try {
    const cssPath = join(process.cwd(), 'public', 'css', 'deferred.css')
    const content = readFileSync(cssPath)
    return createHash('md5').update(content).digest('hex').slice(0, 8)
  } catch {
    // Fallback if file is missing (e.g. during certain build phases)
    return 'fallback'
  }
}

export const DEFERRED_CSS_VERSION = computeVersion()
