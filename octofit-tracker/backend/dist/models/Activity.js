"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' },
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
}, { timestamps: true });
const Activity = (0, mongoose_1.model)('Activity', activitySchema);
exports.default = Activity;
