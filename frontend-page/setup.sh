#!/bin/bash

# InWallz Quick Setup Script
# This script helps you get started quickly

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           InWallz - Quick Setup Script                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📦 Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node -v)"
echo "✅ npm is installed: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🎉 Setup Complete!                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📝 Next Steps:"
    echo ""
    echo "1️⃣  Start the development server:"
    echo "   npm run dev"
    echo ""
    echo "2️⃣  Open your browser to:"
    echo "   http://localhost:3000"
    echo ""
    echo "3️⃣  Start customizing:"
    echo "   - Edit InWallz.jsx (CONFIG object)"
    echo "   - See CUSTOMIZATION_GUIDE.md for details"
    echo ""
    echo "4️⃣  Build for production:"
    echo "   npm run build"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📚 Documentation:"
    echo "   - README.md - Full documentation"
    echo "   - CUSTOMIZATION_GUIDE.md - Customization help"
    echo "   - SETUP_GUIDE.txt - Quick reference"
    echo ""
    echo "🆘 Need help? Check the documentation or contact support"
    echo ""
    echo "Happy coding! 🚀"
    echo ""
else
    echo ""
    echo "❌ Installation failed!"
    echo ""
    echo "Try these solutions:"
    echo "1. Delete node_modules and package-lock.json"
    echo "2. Run: npm install --legacy-peer-deps"
    echo "3. Check your internet connection"
    echo ""
    exit 1
fi
