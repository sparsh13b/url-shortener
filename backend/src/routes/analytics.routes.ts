import { Router } from 'express';
import { getUrlAnalytics } from '../controllers/analytics.controller';

const router = Router();
router.get('/analytics/:slug', getUrlAnalytics);

export default router;