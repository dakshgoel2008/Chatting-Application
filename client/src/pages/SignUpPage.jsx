import { useState } from "react";
import { useUserAuthStore } from "../store/userAuthStore";
import { Eye, EyeOff, Mail, Lock, User, Loader2, MessageSquare } from "lucide-react";
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    return (
        <div className="min-h-screen w-screen grid lg:grid-cols-2 bg-base-100">
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
                            <label className="label" htmlFor="name">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Daksh Goel"
                                    value={formData.name}
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

                        {/* Username (optional) */}
                        <div className="form-control">
                            <label className="label" htmlFor="username">
                                <span className="label-text font-medium">
                                    Username <span className="text-base-content/50">(optional)</span>
                                </span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="e.g. daksh_goel23"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    autoComplete="username"
                                />
                            </div>
                            <p className="text-sm text-base-content/50 mt-1">
                                Leave blank to get an auto-generated username.
                            </p>
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
