"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'your_mongodb_connection_string_here';
mongoose_1.default.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
exports.default = app;
