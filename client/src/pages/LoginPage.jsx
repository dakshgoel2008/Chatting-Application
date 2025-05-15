import { useState } from "react";
import { useUserAuthStore } from "../store/userAuthStore";
import { Eye, EyeOff, Mail, Lock, Loader2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false); // for Eye.
    const [formData, setFormData] = useState({ email: "", password: "" }); // initially empty
    const { logIn, isLoggingIn } = useUserAuthStore(); // fetch logIn function and also status of isLoggingIn

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;

        if (!email || !password) {
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
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                            <p className="text-base-content/60">Log in to continue</p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    className="input input-bordered w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 focus:outline-none"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
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

                    {/* Signup Redirect */}
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="link link-primary font-medium">
                                Sign up
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
