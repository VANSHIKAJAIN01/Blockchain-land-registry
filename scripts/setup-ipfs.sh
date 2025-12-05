#!/bin/bash

echo "🚀 Setting up IPFS for Blockchain Land Registry..."

# Check if IPFS is installed
if ! command -v ipfs &> /dev/null; then
    echo "📦 IPFS not found. Installing via Homebrew..."
    brew install ipfs
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install IPFS via Homebrew."
        echo "Please install manually: https://docs.ipfs.tech/install/command-line/"
        exit 1
    fi
    echo "✅ IPFS installed successfully"
else
    echo "✅ IPFS is already installed"
    ipfs version
fi

# Check if IPFS is initialized
if [ ! -d ~/.ipfs ]; then
    echo "📦 Initializing IPFS..."
    ipfs init
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to initialize IPFS"
        exit 1
    fi
    echo "✅ IPFS initialized"
else
    echo "✅ IPFS is already initialized"
fi

# Check if IPFS daemon is running
if pgrep -x "ipfs" > /dev/null; then
    echo "✅ IPFS daemon is already running"
    echo ""
    echo "IPFS is ready! Your backend will automatically connect to it."
else
    echo ""
    echo "⚠️  IPFS daemon is not running"
    echo ""
    echo "To start IPFS daemon, run in a separate terminal:"
    echo "  ipfs daemon"
    echo ""
    echo "Or run this script with --start flag:"
    echo "  ./scripts/setup-ipfs.sh --start"
fi

# Start daemon if --start flag is provided
if [ "$1" == "--start" ]; then
    echo ""
    echo "🚀 Starting IPFS daemon..."
    echo "Press Ctrl+C to stop"
    echo ""
    ipfs daemon
fi

