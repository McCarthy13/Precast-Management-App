#!/bin/bash

# Setup script for Precast Concrete Management System
# This script handles all necessary initialization steps

echo "Starting Precast Concrete Management System setup..."

# Navigate to the web app directory
cd apps/web

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  echo "Dependencies installed successfully."
else
  echo "Dependencies already installed."
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate
echo "Prisma client generated successfully."

# Ask if user wants to initialize the database
read -p "Do you want to initialize the database with your schema? (y/n): " initialize_db
if [[ $initialize_db == "y" || $initialize_db == "Y" ]]; then
  echo "Initializing database..."
  npx prisma db push
  echo "Database initialized successfully."
fi

# Clean up any Next.js cache
echo "Cleaning up Next.js cache..."
rm -rf .next
echo "Cache cleaned successfully."

echo "Setup complete! You can now start the development server with 'npm run dev'"
