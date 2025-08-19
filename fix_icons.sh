#!/bin/bash

# Remove placeholder
rm -f "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-1024.png.placeholder"

# Create all iOS app icons from the source image
SOURCE="public/E (1).png"
DEST_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"

echo "Creating iOS app icons from $SOURCE..."

# Copy source as 1024px icon first
cp "$SOURCE" "$DEST_DIR/Icon-1024.png"

# Create all required sizes
sips -z 20 20 "$SOURCE" --out "$DEST_DIR/Icon-20.png"
sips -z 40 40 "$SOURCE" --out "$DEST_DIR/Icon-20@2x.png"
sips -z 60 60 "$SOURCE" --out "$DEST_DIR/Icon-20@3x.png"
sips -z 29 29 "$SOURCE" --out "$DEST_DIR/Icon-29.png"
sips -z 58 58 "$SOURCE" --out "$DEST_DIR/Icon-29@2x.png"
sips -z 87 87 "$SOURCE" --out "$DEST_DIR/Icon-29@3x.png"
sips -z 40 40 "$SOURCE" --out "$DEST_DIR/Icon-40.png"
sips -z 80 80 "$SOURCE" --out "$DEST_DIR/Icon-40@2x.png"
sips -z 120 120 "$SOURCE" --out "$DEST_DIR/Icon-40@3x.png"
sips -z 120 120 "$SOURCE" --out "$DEST_DIR/Icon-60@2x.png"
sips -z 180 180 "$SOURCE" --out "$DEST_DIR/Icon-60@3x.png"
sips -z 76 76 "$SOURCE" --out "$DEST_DIR/Icon-76.png"
sips -z 152 152 "$SOURCE" --out "$DEST_DIR/Icon-76@2x.png"
sips -z 167 167 "$SOURCE" --out "$DEST_DIR/Icon-83.5@2x.png"

echo "iOS app icons created successfully!"
ls -la "$DEST_DIR/"
