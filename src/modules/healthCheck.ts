import { Request, Response } from 'express';

export const health = async (req: Request, res: Response) => {
    try {
      res.status(200).json({ message: 'Server is healthy !' });
    } catch (error) {
      res.status(500).json({ error: 'Error Health check', details: error });
    }
  };