#!/bin/bash

# Script to clean up Next.js cache and config files
# This helps resolve persistent startup issues

echo "Starting Next.js cleanup process..."

# Check if .next directory exists and remove it
if [ -d ".next" ]; then
  echo "Removing .next directory..."
  rm -rf .next
  echo ".next directory removed successfully."
else
  echo ".next directory not found, skipping."
fi

# Check if .next-backup directory exists and remove it
if [ -d ".next-backup" ]; then
  echo "Removing .next-backup directory..."
  rm -rf .next-backup
  echo ".next-backup directory removed successfully."
else
  echo ".next-backup directory not found, skipping."
fi

# Check for backup config files and remove them
if [ -f "next.config.js.bak" ]; then
  echo "Removing next.config.js.bak..."
  rm next.config.js.bak
  echo "next.config.js.bak removed successfully."
else
  echo "next.config.js.bak not found, skipping."
fi

if [ -f "next.config.js.old" ]; then
  echo "Removing next.config.js.old..."
  rm next.config.js.old
  echo "next.config.js.old removed successfully."
else
  echo "next.config.js.old not found, skipping."
fi

# Check for node_modules/.cache and remove it
if [ -d "node_modules/.cache" ]; then
  echo "Removing node_modules/.cache directory..."
  rm -rf node_modules/.cache
  echo "node_modules/.cache directory removed successfully."
else
  echo "node_modules/.cache directory not found, skipping."
fi

echo "Next.js cleanup process completed successfully."
echo "You can now restart your Next.js application."
