import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import db from './config/database';
import activitiesRouter from './routes/activities';
import leaderboardRouter from './routes/leaderboard';
import teamsRouter from './routes/teams';
import usersRouter from './routes/users';
import workoutsRouter from './routes/workouts';

dotenv.config();

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME?.trim();
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'OctoFit API is running',
    apiBaseUrl,
    endpoints: ['/api/health', '/api/users', '/api/activities'],
  });
});

app.get('/api/health', (_req, res) => {
  const dbState = db.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    apiPort: port,
    apiBaseUrl,
    mongoPort: 27017,
    database: 'octofit_db',
    dbState,
  });
});

app.listen(port, () => {
  console.log(`OctoFit API running on ${apiBaseUrl}`);
});
