import { Camera, User, Mail, LogOut } from "lucide-react";
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
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner text-primary w-12 h-12 mb-4" />
                    <p className="text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    const handleProfileImageUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("username", user.username);
        formData.append("profileImage", file); // this must match multer field name

        try {
            await updateProfile(formData); // updateProfile now expects FormData
        } catch (err) {
            toast.error(
                err?.response?.data?.message || err?.message || "Updating Profile Image failed. Please try again."
            );
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8 space-y-6">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    <img
                        src={user?.profileImage}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border border-base-300"
                    />
                    <label
                        htmlFor="avatar-upload"
                        className={`absolute bottom-0 right-0 bg-base-content p-1.5 rounded-full cursor-pointer transition ${
                            isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                        }`}
                    >
                        <Camera className="w-4 h-4 text-base-100" />
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfileImageUpdate}
                            disabled={isUpdatingProfile}
                        />
                    </label>
                </div>
                <p className="text-sm text-base-content/50">
                    {isUpdatingProfile ? "Uploading..." : "Tap icon to change"}
                </p>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4 text-sm text-base-content">
                <div>
                    <div className="text-xs text-base-content/60 mb-1">Full Name</div>
                    <div className="px-3 py-2 rounded bg-base-200">{user?.name}</div>
                </div>

                <div>
                    <div className="text-xs text-base-content/60 mb-1">Email Address</div>
                    <div className="px-3 py-2 rounded bg-base-200">{user?.email}</div>
                </div>

                <div>
                    <div className="text-xs text-base-content/60 mb-1">Member Since</div>
                    <div className="px-3 py-2 rounded bg-base-200">
                        {user.createdAt ? user.createdAt.split("T")[0] : "N/A"}
                    </div>
                </div>

                <div>
                    <div className="text-xs text-base-content/60 mb-1">Account Status</div>
                    <div className="px-3 py-2 rounded bg-base-200 text-green-600 font-medium">Active</div>
                </div>

                <button onClick={logOut} className="btn btn-sm btn-error flex items-center gap-2  transition-colors">
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Profile;
