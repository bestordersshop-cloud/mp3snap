import { Request, Response } from 'express';
import { VideoService } from '../services/video.service.js';
import { metadataQueue, conversionQueue } from '../services/queue.service.js';
import logger from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

export class JobController {
  static async analyze(req: Request, res: Response) {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const metadata = await VideoService.analyze(url);
      res.json(metadata);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async convert(req: Request, res: Response) {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const jobId = uuidv4();
      await conversionQueue.add('convert', { jobId, url });
      
      res.status(202).json({ jobId, status: 'pending' });
    } catch (error: any) {
      logger.error('Error creating conversion job:', error);
      res.status(500).json({ error: 'Failed to create conversion job' });
    }
  }

  static async getStatus(req: Request, res: Response) {
    const { id } = req.params;
    
    // In a real app, you would fetch this from PostgreSQL
    // For this scaffold, we'll return a placeholder or check the queue
    res.json({ id, status: 'processing' });
  }

  static async download(req: Request, res: Response) {
    const { id } = req.params;
    // Implementation for secure download
    res.status(501).json({ error: 'Not implemented' });
  }
}
