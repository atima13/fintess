import { Router } from 'express';
import Team from '../models/Team';

const router = Router();

router.get('/', async (_req, res) => {
  const teams = await Team.find().populate('members', 'name fitnessLevel').lean();

  res.status(200).json({
    resource: 'teams',
    count: teams.length,
    items: teams,
  });
});

export default router;
