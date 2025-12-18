"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, _req, res, _next) => {
    res.status(400).json({
        message: err.message || "Something went wrong",
    });
};
exports.errorMiddleware = errorMiddleware;
