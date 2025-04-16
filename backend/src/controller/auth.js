import ErrorWrapper from "./../utils/ErrorWrapper.js";
import ErrorHandler from "./../utils/ErrorHandler.js";
import User from "../models/user.js";

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

    try {
        const user = new User({
            username,
            password,
            name,
            email,
        });
        await user.save();
        const userObject = user.toObject();
        delete userObject.password;
        res.status(201).json({
            message: "User created successfully",
            user: userObject,
            success: true,
        });
    } catch (err) {
        throw new ErrorHandler(500, "Fail to create user", [err.message]);
    }
});

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
    const requiredFields = ["email", "password", "username"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
        throw new ErrorHandler(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    // find user on basis of email or username both are allowed.
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user || !(await user.comparePassword(password))) {
        throw new ErrorHandler(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // want to remove the critical information from the user object.
    user = await User.findOne({
        $or: [{ email }, { username }],
    }).select("-password -refreshToken");

    // console.log(user);
    res.status(200)
        .cookie("RefreshToken", refreshToken)
        .cookie("AccessToken", accessToken)
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
