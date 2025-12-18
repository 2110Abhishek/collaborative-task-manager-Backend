"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/me", auth_middleware_1.requireAuth, auth_controller_1.me);
router.post("/logout", (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
    });
    res.json({ message: "Logged out" });
});
exports.default = router;
