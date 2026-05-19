import type { Request, Response, NextFunction } from 'express';
import { getAuth, clerkClient } from '@clerk/express';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // First try to check role in session claims metadata (requires Clerk JWT Template setup)
    let role = (auth.sessionClaims?.metadata as any)?.role;

    // Fallback: If role is not in the JWT claims, fetch the user from Clerk API directly
    if (!role) {
      const user = await clerkClient.users.getUser(auth.userId);
      role = user.publicMetadata?.role;
    }

    console.log('Admin Auth Check:', { userId: auth.userId, role });

    // DEVELOPMENT BYPASS: Allow access if role is admin OR if we're debugging
    if (role === 'admin' || process.env.NODE_ENV !== 'production') {
      if (role !== 'admin') {
        console.warn(`Dev Bypass: Allowing user ${auth.userId} as admin (no role found)`);
      }
      return next();
    }

    return res.status(403).json({ message: 'Admin access required' });
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
