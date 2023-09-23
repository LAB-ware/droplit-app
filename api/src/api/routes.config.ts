import express, { Router } from 'express';
import UserRouter from './users/users.routes';

const router: Router = express.Router();

router.use('/users', UserRouter);

export default router;
