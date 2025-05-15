import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma-client.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No users found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error); // Pass the error to the next middleware
  }
};
