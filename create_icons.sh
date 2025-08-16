#!/bin/bash

# Script to create iOS app icons from source image
ICON_DIR="/Users/ghazialkhaldi/The Experiential Project/experiential/ios/App/App/Assets.xcassets/AppIcon.appiconset"
SOURCE="/Users/ghazialkhaldi/The Experiential Project/experiential/public/E (1).png"

echo "Creating iOS app icons..."
echo "Source: $SOURCE"
echo "Target: $ICON_DIR"

# Check if source exists
if [ ! -f "$SOURCE" ]; then
    echo "Error: Source file not found: $SOURCE"
    exit 1
fi

# Create all required icon sizes
echo "Creating 20px icons..."
sips -z 20 20 "$SOURCE" --out "$ICON_DIR/Icon-20.png"
sips -z 40 40 "$SOURCE" --out "$ICON_DIR/Icon-20@2x.png"
sips -z 60 60 "$SOURCE" --out "$ICON_DIR/Icon-20@3x.png"

echo "Creating 29px icons..."
sips -z 29 29 "$SOURCE" --out "$ICON_DIR/Icon-29.png"
sips -z 58 58 "$SOURCE" --out "$ICON_DIR/Icon-29@2x.png"
sips -z 87 87 "$SOURCE" --out "$ICON_DIR/Icon-29@3x.png"

echo "Creating 40px icons..."
sips -z 40 40 "$SOURCE" --out "$ICON_DIR/Icon-40.png"
sips -z 80 80 "$SOURCE" --out "$ICON_DIR/Icon-40@2x.png"
sips -z 120 120 "$SOURCE" --out "$ICON_DIR/Icon-40@3x.png"

echo "Creating 60px icons..."
sips -z 120 120 "$SOURCE" --out "$ICON_DIR/Icon-60@2x.png"
sips -z 180 180 "$SOURCE" --out "$ICON_DIR/Icon-60@3x.png"

echo "Creating iPad icons..."
sips -z 76 76 "$SOURCE" --out "$ICON_DIR/Icon-76.png"
sips -z 152 152 "$SOURCE" --out "$ICON_DIR/Icon-76@2x.png"
sips -z 167 167 "$SOURCE" --out "$ICON_DIR/Icon-83.5@2x.png"

echo "Creating App Store icon..."
sips -z 1024 1024 "$SOURCE" --out "$ICON_DIR/Icon-1024.png"

echo "Done! Created all icon sizes."
ls -la "$ICON_DIR"
