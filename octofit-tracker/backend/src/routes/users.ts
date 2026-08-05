import { Router } from 'express';
import User from '../models/User';

const router = Router();

router.get('/', async (_req, res) => {
  const users = await User.find().populate('team', 'name city').lean();

  res.status(200).json({
    resource: 'users',
    count: users.length,
    items: users,
  });
});

export default router;
