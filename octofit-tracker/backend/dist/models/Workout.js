"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    focus: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, min: 10, max: 180, required: true },
    equipment: [{ type: String, trim: true }],
    instructions: [{ type: String, trim: true }],
    suggestedFor: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const Workout = (0, mongoose_1.model)('Workout', workoutSchema);
exports.default = Workout;
