#!/usr/bin/env python3
"""
Asset Optimization Script — Moorti FE
Converts PNGs to WebP (q=82), downsamples background textures to 800px.
Originals are preserved; .webp files are written alongside them.
"""
import os
from PIL import Image

PUBLIC = "/home/ravi/work/ankush/moorti_new/moorti_fe/public"

# Background textures shown at low opacity — 800px is more than enough
TEXTURE_MAX = 800

# Groups
TEXTURE_DIRS = [
    os.path.join(PUBLIC, "patterns"),
]

# Hero/section backgrounds inside images/ — also used as overlays at low opacity
TEXTURE_FILES = {
    "images/hero_blog.png",
    "images/hero_contact.png",
    "images/hero_ganesh.png",
    "images/marble_makrana_white.png",
    "images/marble_vietnam_white.png",
    "images/placeholder.png",
}

# Everything else — keep at native resolution, just compress
# (product cards, tribute images need Retina density)

def convert(src_path: str, max_size: int | None = None):
    rel = os.path.relpath(src_path, PUBLIC)
    dst_path = os.path.splitext(src_path)[0] + ".webp"
    orig_kb = os.path.getsize(src_path) / 1024

    with Image.open(src_path) as img:
        orig_w, orig_h = img.size

        # Downsample if this is a texture
        if max_size and (orig_w > max_size or orig_h > max_size):
            img.thumbnail((max_size, max_size), Image.LANCZOS)

        # Convert RGBA → RGB for WebP lossy (WebP supports RGBA but lossy RGB is smaller)
        if img.mode == "RGBA":
            # Keep RGBA for lossless (logo), use lossless=True
            img.save(dst_path, "WEBP", quality=90, lossless=False, method=6)
        else:
            img.save(dst_path, "WEBP", quality=82, method=6)

    new_kb = os.path.getsize(dst_path) / 1024
    savings = (1 - new_kb / orig_kb) * 100
    new_w, new_h = Image.open(dst_path).size
    print(f"  {rel:55s}  {orig_w}x{orig_h} → {new_w}x{new_h}  "
          f"{orig_kb:7.1f}KB → {new_kb:6.1f}KB  ({savings:.0f}% saved)")

print("=" * 90)
print("Moorti FE — Image Optimization")
print("=" * 90)

total_before = 0
total_after = 0

# --- Texture directories (patterns/) → downsample to 800px ---
print(f"\n[TEXTURES — resize to {TEXTURE_MAX}px max]")
for d in TEXTURE_DIRS:
    for f in sorted(os.listdir(d)):
        if f.lower().endswith(".png"):
            p = os.path.join(d, f)
            total_before += os.path.getsize(p)
            convert(p, max_size=TEXTURE_MAX)
            total_after += os.path.getsize(os.path.splitext(p)[0] + ".webp")

# --- Texture files inside images/ → downsample to 800px ---
print(f"\n[SECTION BACKGROUNDS — resize to {TEXTURE_MAX}px max]")
for rel in sorted(TEXTURE_FILES):
    p = os.path.join(PUBLIC, rel)
    if os.path.isfile(p):
        total_before += os.path.getsize(p)
        convert(p, max_size=TEXTURE_MAX)
        total_after += os.path.getsize(os.path.splitext(p)[0] + ".webp")

# --- All other PNGs (product, process, tribute) → compress only ---
print(f"\n[PRODUCT / PROCESS / TRIBUTE IMAGES — compress only, keep 1024px]")

all_dirs = [
    os.path.join(PUBLIC, "images"),
    os.path.join(PUBLIC),   # tribute PNGs at root
]

for d in all_dirs:
    for f in sorted(os.listdir(d)):
        if not f.lower().endswith(".png"):
            continue
        p = os.path.join(d, f)
        if not os.path.isfile(p):
            continue
        rel = os.path.relpath(p, PUBLIC)
        # Skip if already handled as texture
        if rel in TEXTURE_FILES:
            continue
        # Skip SVGs, Next.js defaults, logo (RGBA — handled separately below)
        if f in ("file.svg", "globe.svg", "next.svg", "vercel.svg", "window.svg"):
            continue
        total_before += os.path.getsize(p)
        max_size = None  # keep native
        convert(p, max_size=max_size)
        total_after += os.path.getsize(os.path.splitext(p)[0] + ".webp")

print("\n" + "=" * 90)
print(f"TOTAL: {total_before/1024/1024:.2f} MB → {total_after/1024/1024:.2f} MB  "
      f"({(1 - total_after/total_before)*100:.0f}% reduction)")
print("=" * 90)
