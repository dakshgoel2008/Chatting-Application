import passport from "passport";
import pkg from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user.js";
import { uploadDefaultGoogleImageOnCloudinary } from "../utils/cloudinary.js";

dotenv.config();

const { Strategy: GoogleStrategy } = pkg;

const port = process.env.PORT || 4444;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || `http://localhost:${port}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if email is provided
                if (!profile.emails || !profile.emails[0]) {
                    return done(new Error("No email provided by Google"), null);
                }

                const email = profile.emails[0].value;
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    // User exists - update Google info if needed
                    if (!existingUser.isGoogleUser) {
                        return done(
                            new Error(
                                "An account with this email already exists. Please login with your email and password."
                            ),
                            null
                        );
                    }
                    if (!existingUser.googleId) {
                        existingUser.googleId = profile.id; // Add Google ID but keep isGoogleUser: false
                        await existingUser.save();
                    }
                    return done(null, existingUser);
                }

                // Create new user
                const photoUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
                let cloudinaryImage = null;

                if (photoUrl) {
                    try {
                        cloudinaryImage = await uploadDefaultGoogleImageOnCloudinary(photoUrl);
                    } catch (imageError) {
                        console.error("Failed to upload profile image:", imageError);
                        // Continue without image rather than failing the entire auth
                    }
                }

                const newUser = new User({
                    name: profile.displayName.toLowerCase(), // Match your schema's lowercase requirement
                    email,
                    profileImage: cloudinaryImage?.secure_url || "",
                    isGoogleUser: true,
                    googleId: profile.id,
                    // Don't set username and password for Google users
                    isEmailVerified: true, // Google emails are pre-verified
                });

                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                console.error("Error during Google authentication:", error);
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
