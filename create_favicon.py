#!/usr/bin/env python3
from PIL import Image
import os

# Get the absolute path of the logo
script_dir = os.path.dirname(os.path.abspath(__file__))
logo_path = os.path.join(script_dir, 'public', 'Furyroad.png')

# Open the logo
img = Image.open(logo_path)

# Get dimensions
width, height = img.size
print(f"Original logo size: {width}x{height}")

# Create square canvas (use max dimension + padding for better visibility)
padding = 100
size = max(width, height) + padding

# Create square image with transparent background
square = Image.new('RGBA', (size, size), (0, 0, 0, 0))

# Paste original image centered
x = (size - width) // 2
y = (size - height) // 2

# Handle transparency
if img.mode == 'RGBA':
    square.paste(img, (x, y), img)
else:
    square.paste(img, (x, y))

# Create different icon sizes
sizes = {
    'icon.png': 32,  # For Next.js app/icon.png
    'apple-touch-icon.png': 180,  # For iOS
    'icon-192.png': 192,  # For PWA
    'icon-512.png': 512,  # For PWA
    'favicon-32x32.png': 32,  # Standard favicon size
    'favicon-16x16.png': 16,  # Standard favicon size
}

# Create icons
for filename, icon_size in sizes.items():
    resized = square.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    if filename == 'icon.png':
        # Next.js expects icon.png in app directory
        output_path = os.path.join(script_dir, 'src', 'app', filename)
        resized.save(output_path, 'PNG')
        print(f"Created {output_path} ({icon_size}x{icon_size})")
    else:
        # Other icons go in public directory
        output_path = os.path.join(script_dir, 'public', filename)
        resized.save(output_path, 'PNG')
        print(f"Created {output_path} ({icon_size}x{icon_size})")

print("All icons created successfully!")

