import { InferSchemaType, Schema, model } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, min: 0, required: true },
    rank: { type: Number, min: 1, required: true },
    weeklyStreak: { type: Number, min: 0, max: 52, required: true },
    periodLabel: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type LeaderboardEntryDocument = InferSchemaType<typeof leaderboardEntrySchema>;

const LeaderboardEntry = model('LeaderboardEntry', leaderboardEntrySchema);

export default LeaderboardEntry;
