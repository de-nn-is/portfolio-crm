import jwt from 'jsonwebtoken';
import { config } from '../utils/config';

export interface JwtPayload {
  userId: string;
  username: string;
}

/**
 * Verify JWT token and return user ID
 */
export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    return payload.userId;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Get user ID from request headers
 */
export function getUserIdFromHeaders(headers: any): string | null {
  const token = extractToken(headers.authorization);
  if (!token) return null;

  return verifyToken(token);
}
