import express, { Router, RequestHandler } from 'express';
import { getAllUsers } from '../controllers/user-controller.js';

const router: Router = express.Router();

router.get('/', getAllUsers as RequestHandler);

export default router;
