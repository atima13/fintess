import { Router } from 'express';
import Workout from '../models/Workout';

const router = Router();

router.get('/', async (_req, res) => {
  const workouts = await Workout.find().populate('suggestedFor', 'name fitnessLevel').lean();

  res.status(200).json({
    resource: 'workouts',
    count: workouts.length,
    items: workouts,
  });
});

export default router;
