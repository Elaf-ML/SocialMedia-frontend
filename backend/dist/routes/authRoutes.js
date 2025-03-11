"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Route for user registration
router.post('/register', authController_1.register);
// Route for user login
router.post('/login', authController_1.login);
// Route for user logout
router.post('/logout', authController_1.logout);
exports.default = router;
