import { useState } from "react";
import { useUserAuthStore } from "../store/userAuthStore";
import { Eye, EyeOff, Mail, Lock, Loader2, MessageSquare, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false); // for Eye.
    const [formData, setFormData] = useState({ email: "", password: "" }); // initially empty
    const { logIn, isLoggingIn } = useUserAuthStore(); // fetch logIn function and also status of isLoggingIn
    const [focusedField, setFocusedField] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;
        if (!email.trim() || !password.trim()) {
            toast.error("Please enter both email and password.");
            return;
        }

        try {
            await logIn(formData);
        } catch (error) {
            console.log("Login Error:", error);
            toast.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
            {/* Left: Login Form */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Header with animated elements */}
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-3">
                                <span className="size-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                                    <LogIn className="size-6 text-white" />
                                </span>
                                <h1 className="text-3xl font-bold ">Welcome Back</h1>
                            </div>
                            <p className="text-gray-500 text-lg">Sign in to continue your journey</p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="Enter your password"
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
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-full rounded-full" disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="animate-spin size-5 mr-2" />
                                    Logging in...
                                </>
                            ) : (
                                "Log In"
                            )}
                        </button>
                    </form>

                    {/* Social Login Options */}
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                                <svg className="size-8 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">
                                    Google
                                </span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                                <svg className="size-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    GitHub
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Signup Redirect */}
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="link link-primary font-medium">
                                Create One Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Image Section */}
            <AuthImagePattern title="Welcome Back!" subtitle="Log in to manage your account and explore more." />
        </div>
    );
};

export default LoginPage;
