# Precast Concrete Management System - Deployment Instructions

This document provides instructions for deploying and running the Precast Concrete Management System.

## System Requirements

- Node.js 16.0.0 or higher
- npm 7.0.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. Extract the project archive to your desired location
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npx prisma generate
```

## Running the Application

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

This will start the development server at http://localhost:3000

### Production Mode

To build and run the application in production mode:

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="your-database-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## Module Structure

The application is organized into the following modules:

- Project Management
- Drafting/Engineering
- Production Scheduling
- Quality Control
- Yard Management
- Shipping/Dispatch
- Field Services
- Document Management
- Safety
- Maintenance
- HR/Personnel
- Environmental/Sustainability
- Client Portal

Each module has its own directory under `apps/web/src/modules/` with the following structure:

```
module_name/
  ├── components/     # UI components
  ├── hooks/          # React hooks
  ├── services/       # Service layer
  │   └── ai/         # AI services
  ├── utils/          # Utility functions
  └── index.js        # Module exports
```

## AI Services Integration

All modules include AI services that provide advanced functionality. These services are located in the `services/ai` directory of each module.

To use an AI service in a component:

```javascript
import { ModuleNameAIService } from '../services/ai/ModuleNameAIService';

// Example usage
const recommendations = await ModuleNameAIService.generateRecommendations(data);
```

## Testing

To run automated tests:

```bash
npm test
```

For integration tests specifically:

```bash
npm run test:integration
```

## Troubleshooting

If you encounter any issues:

1. Verify that all dependencies are installed
2. Check that environment variables are correctly set
3. Ensure the database connection is working
4. Check the console for error messages

For more detailed troubleshooting, refer to the TROUBLESHOOTING.md file.

## Support

For additional support or questions, please contact the development team.
