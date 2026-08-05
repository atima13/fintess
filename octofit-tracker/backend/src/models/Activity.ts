import { InferSchemaType, Schema, model } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    type: {
      type: String,
      enum: ['run', 'cycle', 'yoga', 'strength', 'hiit', 'swim', 'walk'],
      required: true,
    },
    durationMinutes: { type: Number, min: 5, max: 600, required: true },
    caloriesBurned: { type: Number, min: 20, max: 6000, required: true },
    distanceKm: { type: Number, min: 0, max: 1000, default: 0 },
    completedAt: { type: Date, required: true },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export type ActivityDocument = InferSchemaType<typeof activitySchema>;

const Activity = model('Activity', activitySchema);

export default Activity;
