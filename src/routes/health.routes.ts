import { Router} from 'express';
import { databaseHealth} from '../controllers/health.controller.js';

const router = Router();

router.get('/db', databaseHealth);

export default router;