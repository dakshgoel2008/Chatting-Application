import { Camera, User, Mail, Edit3, Check, X, Sparkles } from "lucide-react";
import { useUserAuthStore } from "../store/userAuthStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const { user, isUpdatingProfile, updateProfile, isCheckingAuth, checkAuth } = useUserAuthStore();
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleImageUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("username", user.username);
        formData.append("profileImage", file);

        try {
            await updateProfile(formData);
            toast.success("Profile updated!");
        } catch (err) {
            toast.error("Upload failed. Please try again.");
        }
    };

    const startEdit = (field, value) => {
        setEditingField(field);
        setEditValue(value);
    };

    const saveEdit = async () => {
        if (!editValue.trim() || editValue === user[editingField]) {
            setEditingField(null);
            return;
        }

        try {
            await updateProfile({ [editingField]: editValue.trim() });
            toast.success("Profile updated!");
            setEditingField(null);
        } catch (err) {
            toast.error("Update failed. Please try again.");
        }
    };

    const cancelEdit = () => {
        setEditingField(null);
        setEditValue("");
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-base-content/60">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30">
            <div className="max-w-md mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-base-content">Manage Your Profile</h1>
                </div>

                {/* Profile Card */}
                <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-base-content/5">
                    {/* Avatar Section */}
                    <div className="relative mb-8">
                        <div className="w-32 h-32 mx-auto relative group">
                            <img
                                src={user?.profileImage || "/default-avatar.png"}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            <label className="absolute -bottom-2 -right-2 bg-primary hover:bg-primary/90 p-3 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-110">
                                <Camera className="w-5 h-5 text-primary-content" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpdate}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        {isUpdatingProfile && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-base-100/90 rounded-full p-4">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Fields */}
                    <div className="space-y-6">
                        {/* Name Field */}
                        <div className="group">
                            <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider mb-2 block">
                                Full Name
                            </label>
                            <div className="flex items-center gap-3 p-4 bg-base-200/50 rounded-2xl border border-base-content/10">
                                <User className="w-5 h-5 text-base-content/40" />
                                <span className="flex-1 font-medium">{user?.name || "Not set"}</span>
                            </div>
                        </div>

                        {/* Username Field */}
                        <div className="group">
                            <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider mb-2 block">
                                Username
                            </label>
                            {editingField === "username" ? (
                                <div className="flex items-center gap-2 p-4 bg-base-200/50 rounded-2xl border-2 border-primary/50">
                                    <User className="w-5 h-5 text-primary" />
                                    <input
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 bg-transparent outline-none font-medium"
                                        placeholder="Enter username"
                                    />
                                    <button
                                        onClick={saveEdit}
                                        className="p-1 text-success hover:bg-success/10 rounded-lg"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="p-1 text-error hover:bg-error/10 rounded-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 bg-base-200/50 rounded-2xl border border-base-content/10 group-hover:border-primary/30 transition-colors">
                                    <User className="w-5 h-5 text-base-content/40" />
                                    <span className="flex-1 font-medium">{user?.username || "Not set"}</span>
                                    <button
                                        onClick={() => startEdit("username", user?.username || "")}
                                        className="p-1 text-base-content/40 hover:text-primary hover:bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="group">
                            <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider mb-2 block">
                                Email Address
                            </label>
                            <div className="flex items-center gap-3 p-4 bg-base-200/50 rounded-2xl border border-base-content/10">
                                <Mail className="w-5 h-5 text-base-content/40" />
                                <span className="flex-1 font-medium">{user?.email || "Not set"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="mt-8 pt-6 border-t border-base-content/10">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-base-content/60">Member since</span>
                            <span className="font-medium">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-3">
                            <span className="text-base-content/60">Status</span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
