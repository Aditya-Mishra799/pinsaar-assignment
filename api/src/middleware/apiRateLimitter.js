import rateLimit from "express-rate-limit"

export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
})