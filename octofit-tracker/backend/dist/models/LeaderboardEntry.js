"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const leaderboardEntrySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, min: 0, required: true },
    rank: { type: Number, min: 1, required: true },
    weeklyStreak: { type: Number, min: 0, max: 52, required: true },
    periodLabel: { type: String, required: true, trim: true },
}, { timestamps: true });
const LeaderboardEntry = (0, mongoose_1.model)('LeaderboardEntry', leaderboardEntrySchema);
exports.default = LeaderboardEntry;
