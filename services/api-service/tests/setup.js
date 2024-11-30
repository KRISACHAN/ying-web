// Vitest setup file
import { beforeAll, afterAll } from 'vitest';
import dotenv from 'dotenv';

beforeAll(() => {
    // Load environment variables
    dotenv.config({ path: '.env.test' });
    
    // Add any other setup code here
    // For example: database connection, mock services, etc.
});

afterAll(() => {
    // Cleanup code here
    // For example: close database connections, cleanup mocks, etc.
});
