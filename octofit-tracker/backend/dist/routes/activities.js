"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Activity_1 = __importDefault(require("../models/Activity"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const activities = await Activity_1.default.find()
        .populate('user', 'name fitnessLevel')
        .populate('team', 'name')
        .sort({ completedAt: -1 })
        .lean();
    res.status(200).json({
        resource: 'activities',
        count: activities.length,
        items: activities,
    });
});
exports.default = router;
