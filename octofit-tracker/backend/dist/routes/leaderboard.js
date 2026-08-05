"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LeaderboardEntry_1 = __importDefault(require("../models/LeaderboardEntry"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const entries = await LeaderboardEntry_1.default.find()
        .populate('user', 'name fitnessLevel')
        .populate('team', 'name')
        .sort({ rank: 1 })
        .lean();
    res.status(200).json({
        resource: 'leaderboard',
        count: entries.length,
        items: entries,
    });
});
exports.default = router;
