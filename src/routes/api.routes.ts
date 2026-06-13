import { Router } from 'express';
import { JobController } from '../controllers/job.controller.js';

const router = Router();

router.post('/analyze', JobController.analyze);
router.post('/convert', JobController.convert);
router.get('/job/:id', JobController.getStatus);
router.get('/download/:id', JobController.download);

export default router;
