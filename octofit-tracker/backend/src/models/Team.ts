import { InferSchemaType, Schema, model } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    city: { type: String, required: true, trim: true },
    motto: { type: String, required: true, trim: true },
    points: { type: Number, default: 0 },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export type TeamDocument = InferSchemaType<typeof teamSchema>;

const Team = model('Team', teamSchema);

export default Team;
