import { Router } from 'express';
import Activity from '../models/Activity';

const router = Router();

router.get('/', async (_req, res) => {
  const activities = await Activity.find()
    .populate('user', 'name fitnessLevel')
    .populate('team', 'name')
    .sort({ completedAt: -1 })
    .lean();

  res.status(200).json({
    resource: 'activities',
    count: activities.length,
    items: activities,
  });
});

export default router;
