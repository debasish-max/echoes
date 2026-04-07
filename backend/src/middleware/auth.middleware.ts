import type { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);
    
    if (!auth.userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Check role in session claims metadata
    const role = (auth.sessionClaims?.metadata as any)?.role;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ message: 'Unauthorized access' });
  }
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }
  
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized access' });
    }
  };
