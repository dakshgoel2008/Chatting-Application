import { useState } from "react";
import { useUserAuthStore } from "../../store/userAuthStore";
import { Eye, EyeOff } from "lucide-react";

const Privacy = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        password: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    const { updatePassword, isUpdatingPassword } = useUserAuthStore();

    const handlePasswordChange = async () => {
        setIsPasswordModalOpen(true);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        setPasswordErrors({});

        // Validation
        const errors = {};
        if (!passwordData.password) {
            errors.password = "Current password is required";
        }
        if (!passwordData.newPassword) {
            errors.newPassword = "New password is required";
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = "Password must be at least 6 characters";
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }

        // Call the updatePassword function
        await updatePassword({
            password: passwordData.password,
            newPassword: passwordData.newPassword,
        });

        // Close modal and reset form on success
        setIsPasswordModalOpen(false);
        setPasswordData({
            password: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const handleInputChange = (field, value) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (passwordErrors[field]) {
            setPasswordErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const closeModal = () => {
        setIsPasswordModalOpen(false);
        setPasswordData({
            password: "",
            newPassword: "",
            confirmPassword: "",
        });
        setPasswordErrors({});
        // Reset visibility states
        setShowPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Privacy & Security</h3>
                <p className="text-sm text-base-content/70">Manage your privacy and security settings</p>
            </div>

            <div className="card bg-base-100 shadow-sm">
                <div className="card-body space-y-4">
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Show Online Status</span>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Read Receipts</span>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                    </div>
                    <button
                        className="btn btn-secondary w-40 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        onClick={handlePasswordChange}
                        disabled={isUpdatingPassword}
                    >
                        {isUpdatingPassword ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Updating...
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </button>
                    <button className="btn btn-error w-40">Delete Account</button>
                </div>
            </div>

            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box bg-white rounded-3xl shadow-2xl border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-3xl -m-6 mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Change Password</h3>
                            <p className="text-blue-100">Update your account password for better security</p>
                        </div>

                        <div className="space-y-6">
                            {/* Current Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Current Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`input input-bordered w-full pr-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            passwordErrors.password
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:bg-white"
                                        }`}
                                        value={passwordData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{passwordErrors.password}</span>
                                    </label>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">New Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        className={`input input-bordered w-full pr-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            passwordErrors.newPassword
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:bg-white"
                                        }`}
                                        value={passwordData.newPassword}
                                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{passwordErrors.newPassword}</span>
                                    </label>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Confirm New Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`input input-bordered w-full pr-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            passwordErrors.confirmPassword
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:bg-white"
                                        }`}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {passwordErrors.confirmPassword}
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={closeModal}
                                    disabled={isUpdatingPassword}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePasswordSubmit}
                                    className="btn btn-primary bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                    disabled={isUpdatingPassword}
                                >
                                    {isUpdatingPassword ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Password"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                </div>
            )}
        </div>
    );
};

export default Privacy;
