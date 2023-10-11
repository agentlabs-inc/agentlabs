# !/bin/bash

set -e

cd typescript-client

echo "🚀 Generating typescript client for console..."
sh ./build_for_console.sh
echo "✅ Done!\n"

echo "🚀 Generating typescript client for frontend..."
sh ./build_for_frontend.sh
echo "✅ Done!"
