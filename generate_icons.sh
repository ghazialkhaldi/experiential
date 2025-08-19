#!/bin/bash

# Generate iOS App Icons from source image
# Usage: ./generate_icons.sh

SOURCE_IMAGE="public/AppIcon.png"
ICON_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"

echo "Generating iOS app icons from $SOURCE_IMAGE..."

# Create the AppIcon directory if it doesn't exist
mkdir -p "$ICON_DIR"

# Remove existing icons
rm -f "$ICON_DIR"/AppIcon-*.png

# Generate all required sizes
echo "Creating 120x120 (@2x)..."
sips -z 120 120 "$SOURCE_IMAGE" --out "$ICON_DIR/AppIcon-60@2x.png"

echo "Creating 180x180 (@3x)..."
sips -z 180 180 "$SOURCE_IMAGE" --out "$ICON_DIR/AppIcon-60@3x.png"

echo "Creating 1024x1024 (App Store)..."
sips -z 1024 1024 "$SOURCE_IMAGE" --out "$ICON_DIR/AppIcon-1024.png"

# Create Contents.json
cat > "$ICON_DIR/Contents.json" << 'EOF'
{
  "images" : [
    {
      "filename" : "AppIcon-60@2x.png",
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "60x60"
    },
    {
      "filename" : "AppIcon-60@3x.png",
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "60x60"
    },
    {
      "filename" : "AppIcon-1024.png",
      "idiom" : "ios-marketing",
      "scale" : "1x",
      "size" : "1024x1024"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

echo "✅ Icon generation complete!"
echo "Files created in: $ICON_DIR"
ls -la "$ICON_DIR"
