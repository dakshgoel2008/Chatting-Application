import { Camera, User, Mail } from "lucide-react";
import { useUserAuthStore } from "../store/userAuthStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const ProfilePage = () => {
    const { user, isUpdatingProfile, updateProfile, isCheckingAuth, checkAuth } = useUserAuthStore();

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

    //TODO: Have to work on updation of username
    // const [userName, setUserName] = useState(user?.username || "");

    // useEffect(() => {
    //     if (user?.username) {
    //         setUserName(user.username);
    //     }
    // }, [user?.username]);

    // const handleProfileNameUpdate = async () => {
    //     if (!userName.trim() || userName === user?.username) return;

    //     try {
    //         await updateProfile({ username: userName.trim() });
    //     } catch (err) {
    //         toast.error(
    //             err?.response?.data?.message || err?.message || "Updating Profile Name failed. Please try again."
    //         );
    //     }
    // };

    return (
        <div className="h-screen">
            <div className="max-w-2xl mx-auto p-4 py-8 mt-10">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold ">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>

                    {/* avatar upload section */}

                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={user?.profileImage}
                                alt="Profile"
                                className="size-32 rounded-full object-cover border-4 "
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
                            >
                                <Camera className="w-5 h-5 text-base-200" />
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
                        <p className="text-sm text-zinc-400">
                            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{user?.name}</p>
                        </div>

                        {/* username
                        <div className="flex items-center gap-2">
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                            />
                            <button
                                onClick={handleProfileNameUpdate}
                                disabled={isUpdatingProfile || userName.trim() === user?.username}
                                className="btn btn-sm btn-primary"
                            >
                                {isUpdatingProfile ? <span className="loading loading-spinner w-4 h-4" /> : "Save"}
                            </button>
                        </div> */}

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{user?.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium  mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Member Since</span>
                                <span>{user.createdAt ? user.createdAt.split("T")[0] : "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
