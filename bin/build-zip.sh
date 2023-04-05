#!/bin/sh

THEME_SLUG="jesusfilm-2023"
PROJECT_PATH="."
BUILD_PATH="./build"
DEST_PATH="$BUILD_PATH/$THEME_SLUG"

echo "Generating build directory..."
rm -rf "$BUILD_PATH"
mkdir -p "$DEST_PATH"

echo "Installing JS dependencies..."
npm i

echo "Running JS Build..."
npm run build:prod || exit "$?"

echo "Generating translations..."
npm run i18n || exit "$?"

echo "Syncing files..."
rsync -rc --exclude-from="$PROJECT_PATH/.distignore" "$PROJECT_PATH/" "$DEST_PATH/" --delete --delete-excluded

echo "Generating zip file..."
cd "$BUILD_PATH" || exit
zip -q -r "${THEME_SLUG}.zip" "$THEME_SLUG/"

cd "$PROJECT_PATH" || exit
echo "${THEME_SLUG}.zip file generated!"

echo "Build done!"