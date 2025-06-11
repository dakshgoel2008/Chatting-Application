import { Camera, User, Mail, LogOut, Calendar, Shield } from "lucide-react";
import { useUserAuthStore } from "../../store/userAuthStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, logOut, isUpdatingProfile, updateProfile, isCheckingAuth, checkAuth } = useUserAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return (
            <div className="h-screen bg-[#0b141a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[#8696a0] text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    const handleProfileImageUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // File validation
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
            toast.success("Profile updated");
        } catch (err) {
            toast.error("Upload failed. Try again.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[#0b141a] text-white">
            {/* Header */}
            <div className="bg-[#202c33] px-4 py-6 border-b border-[#2a3942]">
                <div className="max-w-md mx-auto">
                    <h1 className="text-xl font-medium text-[#e9edef]">Profile</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto">
                {/* Profile Picture Section */}
                <div className="bg-[#111b21] px-6 py-8 border-b border-[#2a3942]">
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#2a3942] border-4 border-[#2a3942]">
                                <img
                                    src={user?.profileImage || "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src = "/default-avatar.png";
                                    }}
                                />
                                {isUpdatingProfile && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-2 right-2 bg-[#00a884] hover:bg-[#00a884]/90 p-3 rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 active:scale-95">
                                <Camera className="w-5 h-5 text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleProfileImageUpdate}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-[#8696a0] text-xs mt-3 text-center">
                            {isUpdatingProfile ? "Uploading..." : "Tap to change profile photo"}
                        </p>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-[#111b21]">
                    {/* Name */}
                    <div className="px-6 py-4 border-b border-[#2a3942]">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#2a3942] rounded-full">
                                <User className="w-5 h-5 text-[#8696a0]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-[#8696a0] mb-1 uppercase tracking-wide">Name</div>
                                <div className="text-[#e9edef] font-medium">{user?.name || "Not set"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="px-6 py-4 border-b border-[#2a3942]">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#2a3942] rounded-full">
                                <Mail className="w-5 h-5 text-[#8696a0]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-[#8696a0] mb-1 uppercase tracking-wide">Email</div>
                                <div className="text-[#e9edef] font-medium">{user?.email || "Not set"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="px-6 py-4 border-b border-[#2a3942]">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#2a3942] rounded-full">
                                <Calendar className="w-5 h-5 text-[#8696a0]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-[#8696a0] mb-1 uppercase tracking-wide">Member Since</div>
                                <div className="text-[#e9edef] font-medium">{formatDate(user?.createdAt)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="px-6 py-4 border-b border-[#2a3942]">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#2a3942] rounded-full">
                                <Shield className="w-5 h-5 text-[#8696a0]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-[#8696a0] mb-1 uppercase tracking-wide">Status</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#00a884] rounded-full animate-pulse"></div>
                                    <span className="text-[#00a884] font-medium text-sm">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="p-6">
                    <button
                        onClick={logOut}
                        className="w-full bg-[#2a3942] hover:bg-[#3c4a54] text-[#e9edef] py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-3 active:scale-95"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 pb-8">
                    <p className="text-[#8696a0] text-xs text-center">WhatsApp from Meta</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
