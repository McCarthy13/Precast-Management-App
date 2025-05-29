// Create the lib directory if it doesn't exist
import fs from 'fs';
import path from 'path';

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Create necessary directories for the app
const createAppDirectories = () => {
  const directories = [
    'pages',
    'pages/api',
    'pages/api/auth',
    'components',
    'components/layout',
    'components/ui',
    'styles',
    'public',
    'lib',
    'context',
    'hooks'
  ];
  
  directories.forEach(dir => {
    ensureDirectoryExists(path.join(process.cwd(), dir));
  });
  
  console.log('✅ All directories created successfully');
};

// Run the setup
createAppDirectories();
