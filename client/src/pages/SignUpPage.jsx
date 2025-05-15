import { useState } from "react";
import { useUserAuthStore } from "../store/userAuthStore";
import { Eye, EyeOff, Mail, Lock, User, Loader2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern"; // TODO: Consider dynamic image support later
import toast, { Toaster } from "react-hot-toast";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const { signUp, isSigningUp } = useUserAuthStore();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, email, password } = formData;

        if (!fullName || !email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await signUp(formData);
        } catch (err) {
            console.error("Signup error:", err);
            toast.error("Sign-up error:", err);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
            {/* Left: Form Section */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className="text-base-content/60">Join us and start your journey</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Full Name */}
                        <div className="form-control">
                            <label className="label" htmlFor="fullName">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Daksh Goel"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label" htmlFor="email">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label" htmlFor="password">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="input input-bordered w-full pl-10 pr-10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
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
                            <Link to="/login" className="link link-primary">
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
