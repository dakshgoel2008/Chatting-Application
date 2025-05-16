import ErrorWrapper from "./../utils/ErrorWrapper.js";
import ErrorHandler from "./../utils/ErrorHandler.js";
import User from "../models/user.js";
import uploadOnCloudinary from "./../utils/cloudinary.js";

export const postSignUp = ErrorWrapper(async (req, res, next) => {
    const { email, password, username, name } = req.body;
    const requiredFields = ["email", "password", "username", "name"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
        throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        throw new ErrorHandler(400, "User already exists with this email or username");
    }

    // image upload
    let cloudinaryResponse;
    try {
        cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    } catch (err) {
        throw new ErrorHandler(500, "Failed to upload image", [err.message]);
    }

    try {
        const user = new User({
            username,
            password,
            name,
            email,
            profileImage: cloudinaryResponse.secure_url,
        });
        await user.save();
        const userObject = user.toObject();
        delete userObject.password; // wanna delete the password from user before rendering the user.
        delete userObject.profileImage;
        res.status(201).json({
            message: "User created successfully",
            user: userObject,
            success: true,
        });
    } catch (err) {
        console.error("Error creating user:", err);
        throw new ErrorHandler(500, "Fail to create user", [err.message]);
    }
});

// generating access and refresh token for the authentication.
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        let user = await User.findOne({
            _id: userId,
        });
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        return {
            accessToken,
            refreshToken,
        };
    } catch (err) {
        throw new ErrorHandler(500, "Failed to generate access and refresh tokens", [err.message]);
    }
};

export const postLogin = ErrorWrapper(async (req, res, next) => {
    const { email, password, username } = req.body;
    if (!password) {
        throw new ErrorHandler(400, "Password is required");
    }
    if (!username && !email) {
        throw new ErrorHandler(400, "Either username or email is required");
    }

    // find user on basis of email or username both are allowed.
    let user = await User.findOne({ $or: [{ email }, { username }] });

    // comparePassword: models.
    if (!user || !(await user.comparePassword(password))) {
        throw new ErrorHandler(401, "Invalid email or password");
    }

    // saving the refresh token in the database.
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // want to remove the critical information from the user object.
    user = await User.findOne({
        $or: [{ email }, { username }],
    }).select("-password -refreshToken");

    // console.log(user);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // for XSS attacks
        secure: process.env.NODE_ENV === "development", // for production
        sameSite: "strict", // for CSRF attacks
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict",
            path: "/",
            maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .status(200)
        .json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                image: user.image,
            },
            success: true,
        });
});

export const postLogout = ErrorWrapper(async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ErrorHandler(401, "No refresh token provided");
    }

    // Find user using refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new ErrorHandler(401, "Invalid refresh token");
    }

    // Remove refresh token from the DB
    user.refreshToken = null;
    await user.save();

    // Clear cookies
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
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
    const { name, email, username } = req.body;
    const requiredFields = ["name", "email", "username"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
        throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    // image upload
    let cloudinaryResponse;
    try {
        cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    } catch (err) {
        throw new ErrorHandler(500, "Failed to upload image", [err.message]);
    }

    // find user on basis of email or username both are allowed.
    let user = await User.findOne({ _id: req.user._id });

    if (!user) {
        throw new ErrorHandler(401, "User not found");
    }

    user.username = username;
    user.profileImage = cloudinaryResponse.secure_url;

    await user.save();

    res.status(200).json({
        message: "Profile updated successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
        },
        success: true,
    });
});
