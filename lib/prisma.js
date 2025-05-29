// This file sets up the Prisma client for use throughout the application
import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
// Using JSDoc instead of TypeScript interfaces for JavaScript compatibility
/**
 * @type {PrismaClient}
 */
let prisma;

// Check if we already have a Prisma instance in the global scope
// This prevents multiple instances during hot reloading in development
if (process.env.NODE_ENV === 'development') {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  // In production, create a new instance
  prisma = new PrismaClient();
}

export default prisma;
