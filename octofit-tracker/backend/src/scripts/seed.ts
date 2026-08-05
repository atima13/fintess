import mongoose from 'mongoose';
import Activity from '../models/Activity';
import LeaderboardEntry from '../models/LeaderboardEntry';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
      User.deleteMany({}),
      Team.deleteMany({}),
    ]);

    const [trailBlazers, coreCrushers] = await Team.create([
      {
        name: 'Trail Blazers',
        city: 'Seattle',
        motto: 'Every mile builds momentum',
        points: 2540,
      },
      {
        name: 'Core Crushers',
        city: 'Austin',
        motto: 'Strong core, strong finish',
        points: 2360,
      },
    ]);

    const users = await User.create([
      {
        name: 'Maya Thompson',
        email: 'maya.thompson@octofit.example',
        age: 29,
        fitnessLevel: 'intermediate',
        goals: ['Improve 10k pace', 'Train 5 days/week'],
        weeklyTargetMinutes: 320,
        team: trailBlazers._id,
      },
      {
        name: 'Jordan Lee',
        email: 'jordan.lee@octofit.example',
        age: 34,
        fitnessLevel: 'advanced',
        goals: ['Increase VO2 max', 'Maintain strength cycle'],
        weeklyTargetMinutes: 390,
        team: trailBlazers._id,
      },
      {
        name: 'Ava Patel',
        email: 'ava.patel@octofit.example',
        age: 26,
        fitnessLevel: 'beginner',
        goals: ['Daily movement habit', 'Complete first 5k'],
        weeklyTargetMinutes: 210,
        team: coreCrushers._id,
      },
      {
        name: 'Noah Rivera',
        email: 'noah.rivera@octofit.example',
        age: 31,
        fitnessLevel: 'intermediate',
        goals: ['Reduce body fat', 'Improve recovery'],
        weeklyTargetMinutes: 280,
        team: coreCrushers._id,
      },
    ]);

    await Team.findByIdAndUpdate(trailBlazers._id, {
      members: [users[0]._id, users[1]._id],
    });
    await Team.findByIdAndUpdate(coreCrushers._id, {
      members: [users[2]._id, users[3]._id],
    });

    await Activity.create([
      {
        user: users[0]._id,
        team: trailBlazers._id,
        type: 'run',
        durationMinutes: 48,
        caloriesBurned: 510,
        distanceKm: 8.1,
        completedAt: new Date('2026-08-01T07:20:00Z'),
        notes: 'Steady threshold run with negative splits.',
      },
      {
        user: users[1]._id,
        team: trailBlazers._id,
        type: 'cycle',
        durationMinutes: 62,
        caloriesBurned: 690,
        distanceKm: 24.4,
        completedAt: new Date('2026-08-02T06:15:00Z'),
        notes: 'Morning ride including hill repeats.',
      },
      {
        user: users[2]._id,
        team: coreCrushers._id,
        type: 'walk',
        durationMinutes: 40,
        caloriesBurned: 220,
        distanceKm: 3.7,
        completedAt: new Date('2026-08-02T17:30:00Z'),
        notes: 'Brisk walk to hit daily movement target.',
      },
      {
        user: users[3]._id,
        team: coreCrushers._id,
        type: 'strength',
        durationMinutes: 55,
        caloriesBurned: 460,
        distanceKm: 0,
        completedAt: new Date('2026-08-03T12:05:00Z'),
        notes: 'Upper-body push/pull split with progressive overload.',
      },
      {
        user: users[0]._id,
        team: trailBlazers._id,
        type: 'yoga',
        durationMinutes: 35,
        caloriesBurned: 170,
        distanceKm: 0,
        completedAt: new Date('2026-08-04T20:10:00Z'),
        notes: 'Mobility and recovery flow session.',
      },
    ]);

    await LeaderboardEntry.create([
      {
        user: users[1]._id,
        team: trailBlazers._id,
        points: 980,
        rank: 1,
        weeklyStreak: 6,
        periodLabel: '2026-W31',
      },
      {
        user: users[0]._id,
        team: trailBlazers._id,
        points: 910,
        rank: 2,
        weeklyStreak: 5,
        periodLabel: '2026-W31',
      },
      {
        user: users[3]._id,
        team: coreCrushers._id,
        points: 860,
        rank: 3,
        weeklyStreak: 4,
        periodLabel: '2026-W31',
      },
      {
        user: users[2]._id,
        team: coreCrushers._id,
        points: 740,
        rank: 4,
        weeklyStreak: 3,
        periodLabel: '2026-W31',
      },
    ]);

    await Workout.create([
      {
        title: 'Tempo Builder 45',
        focus: 'Cardio Endurance',
        difficulty: 'intermediate',
        durationMinutes: 45,
        equipment: ['Running shoes', 'Heart-rate monitor'],
        instructions: [
          '10-minute warmup jog',
          '3 x 8 minutes at tempo effort with 2-minute easy jog between',
          '5-minute cooldown',
        ],
        suggestedFor: [users[0]._id, users[1]._id],
      },
      {
        title: 'Foundations Circuit',
        focus: 'Full Body Strength',
        difficulty: 'beginner',
        durationMinutes: 30,
        equipment: ['Yoga mat', 'Light dumbbells'],
        instructions: [
          '3 rounds: 12 squats, 10 incline pushups, 30-second plank',
          'Rest 60 seconds between rounds',
          'Finish with 5-minute stretching cooldown',
        ],
        suggestedFor: [users[2]._id],
      },
      {
        title: 'Power and Core Blend',
        focus: 'Strength and Stability',
        difficulty: 'advanced',
        durationMinutes: 50,
        equipment: ['Barbell', 'Kettlebell', 'Resistance band'],
        instructions: [
          '4 x 5 deadlifts at moderate-heavy load',
          '3 x 8 kettlebell swings with controlled tempo',
          'Core finisher: 3 rounds of 45-second side planks each side',
        ],
        suggestedFor: [users[1]._id, users[3]._id],
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
