import jwt from 'jsonwebtoken';
import { getEncryptionKey } from './wab/server/secrets';

// Generate a test JWT token for development
const testUser = {
  userId: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  // Add any other user properties you need
};

const token = jwt.sign(testUser, getEncryptionKey(), {
  expiresIn: '7d', // Token expires in 7 days
});

console.log('Test JWT Token:', token);
console.log('Use this token by adding ?token=YOUR_TOKEN to URLs or as Authorization: Bearer YOUR_TOKEN header');