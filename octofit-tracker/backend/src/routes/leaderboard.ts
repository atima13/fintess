import { Router } from 'express';
import LeaderboardEntry from '../models/LeaderboardEntry';

const router = Router();

router.get('/', async (_req, res) => {
  const entries = await LeaderboardEntry.find()
    .populate('user', 'name fitnessLevel')
    .populate('team', 'name')
    .sort({ rank: 1 })
    .lean();

  res.status(200).json({
    resource: 'leaderboard',
    count: entries.length,
    items: entries,
  });
});

export default router;
