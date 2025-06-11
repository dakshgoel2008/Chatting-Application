import { useState } from "react";
import { useUserAuthStore } from "../store/userAuthStore";
import { Eye, EyeOff, Mail, Lock, User, Loader2, MessageSquare, CheckCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern"; // TODO: Consider dynamic image support later
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        username: "",
        profileImage: null,
    });
    const { signUp, isSigningUp } = useUserAuthStore();
    const [focusedField, setFocusedField] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    // random user generator -> identity retrieval is easy.
    const usernameGenerator = (name) => {
        const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number
        const base = name.trim().toLowerCase().replace(/\s+/g, "_");
        return `${base}_${randomNum}`;
    };

    // ProfileImage generator:
    const fetchAvatarFile = async (name) => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
        )}&background=random&color=fff&size=128`;
        const res = await axios.get(avatarUrl, { responseType: "blob" });
        const blob = res.data;

        return new File([blob], "avatar.png", { type: blob.type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, username } = formData;

        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        const finalUsername = username || usernameGenerator(name);
        const avatarFile = await fetchAvatarFile(name);
        const formDataToSend = new FormData();
        formDataToSend.append("name", name);
        formDataToSend.append("email", email);
        formDataToSend.append("password", password);
        formDataToSend.append("username", finalUsername);
        formDataToSend.append("profileImage", avatarFile);

        try {
            await signUp(formDataToSend); // signUp must use multipart/form-data
        } catch (err) {
            console.error("Signup error:", err);
            toast.error("Sign-up failed. Check console for more.");
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;

        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Character variety checks
        if (/[a-z]/.test(password)) strength++; // lowercase
        if (/[A-Z]/.test(password)) strength++; // uppercase
        if (/[0-9]/.test(password)) strength++; // numbers
        if (/[^A-Za-z0-9]/.test(password)) strength++; // special characters

        return Math.min(strength, 5); // Cap at 5
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return "bg-red-500";
        if (passwordStrength <= 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 1) return "Weak";
        if (passwordStrength <= 3) return "Medium";
        return "Strong";
    };

    return (
        <div className="h-screen overflow-y-auto grid lg:grid-cols-2 bg-base-100 ">
            {/* Left: Form Section */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Header with animated elements */}
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-3 mt-5">
                                <span className="size-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                    <Users className="size-6 text-white" />
                                </span>
                                <h1 className="text-3xl font-bold">Create Account</h1>
                            </div>
                            <p className="text-gray-500 text-lg">Join us and start your journey</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Full Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold  block">Full Name</label>
                            <div className="relative group">
                                <User
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors duration-300 ${
                                        focusedField === "name" ? "text-emerald-500" : "text-gray-400"
                                    }`}
                                />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                                        focusedField === "name"
                                            ? "border-emerald-500 shadow-lg shadow-emerald-100"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField("name")}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold  block">Email Address</label>
                            <div className="relative group">
                                <Mail
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors duration-300 ${
                                        focusedField === "email" ? "text-emerald-500" : "text-gray-400"
                                    }`}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                                        focusedField === "email"
                                            ? "border-emerald-500 shadow-lg shadow-emerald-100"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold  block">Password</label>
                            <div className="relative group">
                                <Lock
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors duration-300 ${
                                        focusedField === "password" ? "text-emerald-500" : "text-gray-400"
                                    }`}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                                        focusedField === "password"
                                            ? "border-emerald-500 shadow-lg shadow-emerald-100"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Password strength:</span>
                                        <span
                                            className={`font-medium ${
                                                passwordStrength <= 1
                                                    ? "text-red-500"
                                                    : passwordStrength <= 3
                                                    ? "text-yellow-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Username Field (Optional) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold block">
                                Username <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div className="relative group">
                                <User
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors duration-300 ${
                                        focusedField === "username" ? "text-emerald-500" : "text-gray-400"
                                    }`}
                                />
                                <input
                                    type="text"
                                    name="username"
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                                        focusedField === "username"
                                            ? "border-emerald-500 shadow-lg shadow-emerald-100"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField("username")}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                            <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                                💡 Leave blank for an auto-generated username
                            </p>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                            <CheckCircle className="size-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600 leading-relaxed">
                                By creating an account, you agree to our{" "}
                                <Link
                                    to="/terms-of-service"
                                    className="text-emerald-600 font-medium hover:text-emerald-800 transition-colors"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    to="/privacy-policy"
                                    className="text-emerald-600 font-medium hover:text-emerald-800 transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary w-full rounded-full" disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Switch to Login */}
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary font-medium">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Pattern / Image */}
            <AuthImagePattern title="Join our community" subtitle="Connect, share, and grow with others like you!" />

            {/* Toaster for notifications */}
            <Toaster position="top-center" />
        </div>
    );
};

export default SignUpPage;
