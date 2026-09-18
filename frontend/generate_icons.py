import os
from PIL import Image, ImageDraw

# Use ems_logo.png directly as requested by the user
logo_path = os.path.join("src", "components", "PremiumLogo", "ems_logo.png")
res_dir = os.path.join("android", "app", "src", "main", "res")

img = Image.open(logo_path).convert("RGBA")
w, h = img.size
print(f"Loaded {logo_path} ({w}x{h})")

# Sizes for adaptive icon foregrounds (108dp base, centered safely in 72dp)
fg_densities = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432
}

# Standard launcher icons (legacy square and round)
launcher_densities = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

# 1. Generate Adaptive Foregrounds
for folder, size in fg_densities.items():
    dest_folder = os.path.join(res_dir, folder)
    os.makedirs(dest_folder, exist_ok=True)
    
    fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    # Fill foreground with scaled logo (78% of size so it fits inside safe zone)
    logo_size = int(size * 0.78)
    scaled_logo = img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    offset = ((size - logo_size) // 2, (size - logo_size) // 2)
    fg.paste(scaled_logo, offset, scaled_logo)
    
    fg.save(os.path.join(dest_folder, "ic_launcher_foreground.png"), "PNG")
    print(f"Saved {folder}/ic_launcher_foreground.png ({size}x{size})")

# 2. Generate Square and Round Icons
for folder, size in launcher_densities.items():
    dest_folder = os.path.join(res_dir, folder)
    os.makedirs(dest_folder, exist_ok=True)
    
    # Square icon
    sq = img.resize((size, size), Image.Resampling.LANCZOS)
    sq.save(os.path.join(dest_folder, "ic_launcher.png"), "PNG")
    
    # Round icon (circular mask)
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    round_icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    round_icon.paste(sq, (0, 0), mask)
    round_icon.save(os.path.join(dest_folder, "ic_launcher_round.png"), "PNG")
    print(f"Saved {folder}/ic_launcher.png & ic_launcher_round.png ({size}x{size})")

# 3. Generate Splash screens
splash_portrait = {
    "drawable": (480, 800),
    "drawable-port-mdpi": (320, 480),
    "drawable-port-hdpi": (480, 800),
    "drawable-port-xhdpi": (720, 1280),
    "drawable-port-xxhdpi": (1080, 1920),
    "drawable-port-xxxhdpi": (1440, 2560)
}

splash_landscape = {
    "drawable-land-mdpi": (480, 320),
    "drawable-land-hdpi": (800, 480),
    "drawable-land-xhdpi": (1280, 720),
    "drawable-land-xxhdpi": (1920, 1080),
    "drawable-land-xxxhdpi": (2560, 1440)
}

def create_splash(folder, width, height):
    dest_folder = os.path.join(res_dir, folder)
    os.makedirs(dest_folder, exist_ok=True)
    
    # Luxury dark background matching the home page theme (#060919)
    bg = Image.new("RGBA", (width, height), (6, 9, 25, 255))
    
    # Center the round EMS logo at ~45% of minimum screen dimension
    logo_dim = int(min(width, height) * 0.45)
    resized_logo = img.resize((logo_dim, logo_dim), Image.Resampling.LANCZOS)
    
    pos = ((width - logo_dim) // 2, (height - logo_dim) // 2)
    bg.paste(resized_logo, pos, resized_logo)
    
    bg.save(os.path.join(dest_folder, "splash.png"), "PNG")
    print(f"Saved {folder}/splash.png ({width}x{height})")

for folder, (w, h) in splash_portrait.items():
    create_splash(folder, w, h)

for folder, (w, h) in splash_landscape.items():
    create_splash(folder, w, h)

print("\nSUCCESS: All Android icons and splash screens generated from ems_logo.png!")
