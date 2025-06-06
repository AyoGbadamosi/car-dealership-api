import mongoose from "mongoose";
import app from "../app";
import Admin from "../models/Admin";
import { UserRole } from "../enums/role.enum";

// Ensure JWT_SECRET is set for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

let server: any;
const testDbUri = process.env.MONGODB_URI?.replace(/\/[^/]+$/, '/test-db') || 'mongodb://localhost:27017/test-db';

// Set timeout to 5 minutes
jest.setTimeout(300000);

let isSetupComplete = false;

beforeAll(async () => {
  try {
    // Only run setup once globally
    if (isSetupComplete) {
      return;
    }

    // Disconnect any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Connect to test database
    await mongoose.connect(testDbUri);
    console.log('Connected to test database:', testDbUri);

    // Clear the entire database
    await mongoose.connection.db.dropDatabase();
    console.log('Test database cleared');

    // Create admin user
    const adminEmail = "admin@cardealers.com";
    const adminPassword = "Password1@";
    
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword,
      role: UserRole.ADMIN,
      lastLogin: new Date()
    });
    await admin.save();
    console.log("Admin user created for tests");

    // Start server
    server = app.listen(0, () => {
      console.log('Test server started');
    });

    isSetupComplete = true;
  } catch (error) {
    console.error('Failed to start test environment:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    throw error;
  }
});

beforeEach(async () => {
  try {
    // Ensure database connection is alive
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(testDbUri);
    }
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Clean all collections except admins
    for (const collection of collections) {
      if (collection.name !== 'admins') {
        await mongoose.connection.db.collection(collection.name).deleteMany({});
      }
    }
  } catch (error) {
    console.error('Failed to clean collections:', error);
    throw error;
  }
});

afterEach(async () => {
  // Wait for any pending operations to complete
  await new Promise(resolve => setTimeout(resolve, 100));
});

afterAll(async () => {
  try {
    // Close the server first
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err: Error | undefined) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log('Test server closed');
    }

    // Close mongoose connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Failed to cleanup test environment:', error);
  }
});

// Global error handlers for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception:', error);
});