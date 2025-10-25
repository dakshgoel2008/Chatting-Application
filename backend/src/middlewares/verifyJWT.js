import jwt from "jsonwebtoken";
import User from "../models/user.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const verifyJWT = ErrorWrapper(async (req, res, next) => {
    // Try cookies first (for backward compatibility)
    let incomingAccessToken = req.cookies?.accessToken;
    let incomingRefreshToken = req.cookies?.refreshToken;

    // If not in cookies, check Authorization header
    if (!incomingAccessToken) {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            incomingAccessToken = authHeader.substring(7);
        }
    }

    // Check for refresh token in custom header
    if (!incomingRefreshToken) {
        incomingRefreshToken = req.headers["x-refresh-token"];
    }

    if (!incomingAccessToken || !incomingRefreshToken) {
        throw new ErrorHandler(401, "Unauthorized user, Kindly login first");
    }

    try {
        let decodedAccessToken = jwt.verify(incomingAccessToken, process.env.ACCESS_TOKEN_KEY);
        let user = await User.findOne({
            _id: decodedAccessToken.userId,
        });

        if (!user) {
            throw new ErrorHandler(401, "User not found");
        }

        let userRefreshToken = user.refreshToken;
        if (userRefreshToken !== incomingRefreshToken) {
            throw new ErrorHandler(401, "Invalid refresh token");
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.name, err.message);

        if (err.name === "TokenExpiredError") {
            throw new ErrorHandler(401, "Access token expired");
        }
        if (err.name === "JsonWebTokenError") {
            throw new ErrorHandler(401, "Invalid token");
        }

        throw new ErrorHandler(500, "Internal Server Error");
    }
});
