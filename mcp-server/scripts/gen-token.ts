// scripts/gen-token.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const token = jwt.sign(
  { id: 'user123', email: 'test@example.com' },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);

console.log('Your JWT token:', token);