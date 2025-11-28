"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes/routes");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN, credentials: true }));
const limit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 150,
    message: "Too many requests from this IP, please try again after a minute",
    standardHeaders: true,
    legacyHeaders: true,
});
exports.app.use(express_1.default.json({ limit: '10kb' }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.use(express_1.default.static("public"));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use("/api/v1", (0, helmet_1.default)(), limit, routes_1.router);
exports.app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
