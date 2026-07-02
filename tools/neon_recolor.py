#!/usr/bin/env python3
"""
neon_recolor.py  -  Recolor animated GIF icons to a neon colour.

Strategy
--------
  MIXED  (GIF has both dark/black AND a neon colour):
         Only the black/dark pixels are replaced with neon.
         The coloured strokes are left untouched.
         → Result: all visible pixels become the same neon.

  SINGLE (GIF is essentially one dominant colour – no significant black):
         All visible pixels have their RGB replaced with neon.
         Alpha is ALWAYS preserved so anti-aliased edges stay smooth.

Usage
-----
  # Test on one file:
  python3 tools/neon_recolor.py img/icons/19026424.gif /tmp/test_neon.gif

  # Batch – overwrite in place:
  python3 tools/neon_recolor.py --batch img/icons img/icons

  # Batch – write to a new folder:
  python3 tools/neon_recolor.py --batch img/icons img/icons_neon

Options
-------
  --color   Hex colour to paint, default #00C4F0 (matches site Lordicons/CSS --primary)
  --tol     Tolerance 0-1 for black-matching in MIXED mode, default 0.22
  --dark-t  Dark threshold 0-255; pixels with ALL channels below this = "black", default 70
"""

import sys
import os
import argparse
import numpy as np
from PIL import Image

# ── defaults ──────────────────────────────────────────────────────────────────
DEFAULT_HEX  = "#00C4F0"   # matches CSS var(--primary) and all Lordicons on site
TOLERANCE    = 0.22        # 22% of max RGB distance (~97 in 0-255 space)
DARK_THRESH  = 70          # any pixel with R,G,B all < this is "black"
MAX_DIST     = 441.67      # sqrt(255²×3)


# ── helpers ───────────────────────────────────────────────────────────────────

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def detect_mode(gif_path, dark_t):
    """Return 'mixed' or 'single' based on colour composition."""
    img = Image.open(gif_path)
    n   = getattr(img, 'n_frames', 1)
    dark = bright = 0

    for fi in range(0, n, max(1, n // 6)):
        img.seek(fi)
        arr = np.array(img.convert('RGBA'), dtype=np.float32)
        vis = arr[:, :, 3] > 128
        rgb = arr[:, :, :3][vis]
        if len(rgb):
            is_dark  = np.all(rgb < dark_t, axis=1)
            dark    += int(np.sum(is_dark))
            bright  += int(np.sum(~is_dark))

    total = dark + bright
    if total == 0:
        return 'single'
    return 'mixed' if dark / total > 0.15 and bright > 50 else 'single'


def recolor_frame(frame, mode, neon_rgb, tol, dark_t):
    """
    Recolour one RGBA PIL frame.  Returns a new RGBA PIL image.
    Alpha channel is NEVER modified – anti-aliased edges stay smooth.
    """
    arr  = np.array(frame.convert('RGBA'), dtype=np.float32)
    out  = arr.copy()
    alpha = arr[:, :, 3]
    rgb   = arr[:, :, :3]
    vis   = alpha > 4          # any pixel with even a trace of opacity
    nr, ng, nb = neon_rgb

    if mode == 'single':
        # Replace ALL visible pixels with neon, keep alpha
        out[vis, 0] = nr
        out[vis, 1] = ng
        out[vis, 2] = nb

    else:
        # MIXED mode: the GIF has dark/black parts AND coloured/teal parts.
        # Strategy: replace EVERYTHING that isn't a bright white highlight with
        # the neon colour.  White highlights (avg channel > WHITE_KEEP) are kept
        # so the icon retains its visual depth and shading.
        # The tolerance/fuzz creates a smooth gradient at the white→neon boundary.
        WHITE_KEEP  = 200.0   # pixels with avg brightness above this stay white
        BLEND_RANGE = 30.0    # fade zone width (pixels within WHITE_KEEP ± this blend)

        brightness = rgb.mean(axis=2)  # per-pixel average of R,G,B

        # Hard neon zone: not too bright
        neon_zone  = vis & (brightness < WHITE_KEEP - BLEND_RANGE)
        # Blend zone: approaching white threshold
        blend_zone = vis & (brightness >= WHITE_KEEP - BLEND_RANGE) & (brightness < WHITE_KEEP)
        # White zone (highlights): keep as-is
        # white_zone = vis & (brightness >= WHITE_KEEP)  — already untouched in out

        out[neon_zone, 0] = nr
        out[neon_zone, 1] = ng
        out[neon_zone, 2] = nb

        if np.any(blend_zone):
            # t goes 0→1 as brightness goes (WHITE_KEEP-BLEND_RANGE)→WHITE_KEEP
            t = (brightness[blend_zone] - (WHITE_KEEP - BLEND_RANGE)) / BLEND_RANGE
            out[blend_zone, 0] = nr * (1 - t) + rgb[blend_zone, 0] * t
            out[blend_zone, 1] = ng * (1 - t) + rgb[blend_zone, 1] * t
            out[blend_zone, 2] = nb * (1 - t) + rgb[blend_zone, 2] * t

    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def process_gif(input_path, output_path, neon_rgb, tol, dark_t):
    print(f"\n  {os.path.basename(input_path)}", end="  ", flush=True)

    img  = Image.open(input_path)
    n    = getattr(img, 'n_frames', 1)
    mode = detect_mode(input_path, dark_t)
    img  = Image.open(input_path)   # re-open fresh after seeking in detect_mode

    print(f"[{mode}, {n} frames]", end="  ", flush=True)

    frames    = []
    durations = []

    for i in range(n):
        img.seek(i)
        duration = img.info.get('duration', 100)
        frame    = recolor_frame(img, mode, neon_rgb, tol, dark_t)
        frames.append(frame)
        durations.append(duration)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    frames[0].save(
        output_path,
        save_all     = True,
        append_images= frames[1:],
        loop         = 0,
        duration     = durations,
        disposal     = 2,
        optimize     = False,
    )
    print(f"→ saved", flush=True)


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser(description="Recolour GIF icons to neon")
    p.add_argument('input',  help='Input GIF file or directory')
    p.add_argument('output', nargs='?', help='Output GIF file or directory')
    p.add_argument('--batch',  action='store_true', help='Process every .gif in input dir')
    p.add_argument('--color',  default=DEFAULT_HEX,  help=f'Target hex colour (default {DEFAULT_HEX})')
    p.add_argument('--tol',    type=float, default=TOLERANCE,   help='Black tolerance 0-1')
    p.add_argument('--dark-t', type=int,   default=DARK_THRESH, help='Dark pixel threshold 0-255')
    args = p.parse_args()

    neon_rgb = hex_to_rgb(args.color)
    print(f"Neon colour: #{args.color.lstrip('#').upper()}  RGB{neon_rgb}")
    print(f"Tolerance  : {args.tol:.0%}  |  Dark threshold: {args.dark_t}")

    if args.batch:
        in_dir  = args.input
        out_dir = args.output or (in_dir + '_neon')
        gifs    = sorted(f for f in os.listdir(in_dir) if f.lower().endswith('.gif'))
        print(f"\nBatch: {len(gifs)} GIFs  {in_dir} → {out_dir}")
        for g in gifs:
            process_gif(
                os.path.join(in_dir, g),
                os.path.join(out_dir, g),
                neon_rgb, args.tol, args.dark_t
            )
    else:
        out = args.output or args.input.replace('.gif', '_neon.gif')
        process_gif(args.input, out, neon_rgb, args.tol, args.dark_t)

    print("\n\nDone.")


if __name__ == '__main__':
    main()
