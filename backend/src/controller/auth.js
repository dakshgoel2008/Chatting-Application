import ErrorWrapper from "./../utils/ErrorWrapper.js";
import ErrorHandler from "./../utils/ErrorHandler.js";
import User from "../models/user.js";
import uploadOnCloudinary from "./../utils/cloudinary.js";

// generating access and refresh token helper function (keep as is)
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        let user = await User.findById(userId); // Use findById for simplicity
        if (!user) {
            // Add check if user exists
            throw new ErrorHandler(404, "User not found when generating tokens");
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken; // Save refresh token here
        await user.save({ validateBeforeSave: false }); // Save immediately
        return { accessToken, refreshToken };
    } catch (err) {
        // Log the underlying error for debugging
        console.error("Error generating tokens:", err);
        throw new ErrorHandler(500, "Failed to generate access and refresh tokens", [err.message]);
    }
};

export const postSignUp = ErrorWrapper(async (req, res, next) => {
    const { email, password, username, name } = req.body;
    const requiredFields = ["email", "password", "username", "name"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
        throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ErrorHandler(400, "User already exists with this email or username");
    }

    // *** MODIFIED: Check if req.file exists ***
    if (!req.file || !req.file.buffer) {
        throw new ErrorHandler(400, "Profile image is required for signup.");
    }

    let cloudinaryResponse;
    try {
        cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);
        // Check if uploadOnCloudinary returned an error object
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            throw new Error(cloudinaryResponse?.error || "Cloudinary upload failed");
        }
    } catch (err) {
        console.error("Cloudinary Upload Error during signup:", err);
        // Provide more specific error message if possible
        throw new ErrorHandler(500, `Failed to upload image: ${err.message}`);
    }

    try {
        const user = new User({
            username,
            password,
            name,
            email,
            profileImage: cloudinaryResponse.secure_url, // Use secure_url
        });
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.refreshToken; // Also remove refresh token if somehow present

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: userObject._id,
                username: userObject.username,
                email: userObject.email,
                name: userObject.name,
            },
            success: true,
        });
    } catch (err) {
        console.error("Error creating user:", err);
        throw new ErrorHandler(500, `Failed to create user: ${err.message}`);
    }
});

export const postLogin = ErrorWrapper(async (req, res, next) => {
    const { email, password, username } = req.body;
    if (!password) {
        throw new ErrorHandler(400, "Password is required");
    }
    if (!username && !email) {
        throw new ErrorHandler(400, "Either username or email is required");
    }

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user || !(await user.comparePassword(password))) {
        throw new ErrorHandler(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const userForResponse = await User.findById(user._id).select("-password -refreshToken");
    if (!userForResponse) {
        throw new ErrorHandler(404, "User not found after token generation");
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .status(200)
        .json({
            message: "Logged in successfully",
            user: {
                _id: userForResponse._id,
                username: userForResponse.username,
                email: userForResponse.email,
                name: userForResponse.name,
                profileImage: userForResponse.profileImage,
                createdAt: userForResponse.createdAt,
            },
            accessToken, // Send tokens in response as well
            refreshToken, // Frontend can store these
            success: true,
        });
});

export const postLogout = ErrorWrapper(async (req, res, next) => {
    // Get refresh token from cookies or header
    let refreshToken = req.cookies?.refreshToken || req.headers["x-refresh-token"];

    if (refreshToken) {
        try {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save({ validateBeforeSave: false });
            }
        } catch (dbError) {
            console.error("Error clearing refresh token from DB during logout:", dbError);
        }
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);

    res.status(200).json({
        message: "Logged out successfully",
        success: true,
    });
});

export const putUpdateProfile = ErrorWrapper(async (req, res, next) => {
    const { name, username } = req.body;
    const userId = req.user._id;

    if (!name && !username && !req.file) {
        throw new ErrorHandler(400, "No profile information provided to update.");
    }
    if (name && name.trim().length === 0) {
        throw new ErrorHandler(400, "Name cannot be empty.");
    }
    if (username && username.trim().length === 0) {
        throw new ErrorHandler(400, "Username cannot be empty.");
    }

    let user = await User.findById(userId);
    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    let updateData = {};

    if (name) updateData.name = name.trim();
    if (username) {
        if (username.trim().toLowerCase() !== user.username) {
            const existingUser = await User.findOne({ username: username.trim().toLowerCase() });
            if (existingUser) {
                throw new ErrorHandler(400, "Username already taken.");
            }
            updateData.username = username.trim().toLowerCase();
        }
    }

    if (req.file && req.file.buffer) {
        let cloudinaryResponse;
        try {
            cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                throw new Error(cloudinaryResponse?.error || "Cloudinary upload failed during profile update");
            }
            updateData.profileImage = cloudinaryResponse.secure_url;
        } catch (err) {
            console.error("Cloudinary Upload Error during profile update:", err);
            throw new ErrorHandler(500, `Failed to upload new profile image: ${err.message}`);
        }
    }

    if (Object.keys(updateData).length > 0) {
        Object.assign(user, updateData);
        await user.save();
    }

    const updatedUser = await User.findById(userId).select("-password -refreshToken");
    if (!updatedUser) {
        throw new ErrorHandler(404, "Updated user not found");
    }

    res.status(200).json({
        message: "Profile updated successfully",
        user: {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            name: updatedUser.name,
            profileImage: updatedUser.profileImage,
            createdAt: updatedUser.createdAt,
        },
        success: true,
    });
});

export const putUpdatePassword = ErrorWrapper(async (req, res, next) => {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
        throw new ErrorHandler(400, "Both current and new passwords are required.");
    }
    if (newPassword.length < 6) {
        throw new ErrorHandler(400, "New password must be at least 6 characters long.");
    }
    if (password === newPassword) {
        throw new ErrorHandler(400, "New password cannot be the same as the current password.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    if (!(await user.comparePassword(password))) {
        throw new ErrorHandler(401, "Incorrect current password.");
    }

    user.password = newPassword;
    user.refreshToken = null;
    await user.save();

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);

    res.status(200).json({
        message: "Password updated successfully. Please log in again.", // Inform user about re-login
        success: true,
    });
});

export const postDeleteAccount = ErrorWrapper(async (req, res, next) => {
    // Keep validation as is
    const { password } = req.body;
    if (!password) {
        throw new ErrorHandler(400, "Password is required to delete account.");
    }

    const user = await User.findById(req.user._id); // Use findById
    if (!user) {
        throw new ErrorHandler(404, "User not found."); // Changed to 404
    }

    if (!(await user.comparePassword(password))) {
        // Use a more specific error message
        throw new ErrorHandler(401, "Incorrect password. Account not deleted.");
    }

    await user.deleteOne(); // Use deleteOne()

    // Clear cookies after successful deletion
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);

    res.status(200).json({
        message: "Account deleted successfully",
        success: true,
    });
});
