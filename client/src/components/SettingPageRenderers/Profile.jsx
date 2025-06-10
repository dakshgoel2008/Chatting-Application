const Profile = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Profile Settings</h3>
                <p className="text-sm text-base-content/70">Manage your personal information</p>
            </div>

            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <h4 className="card-title text-lg">Personal Information</h4>
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Display Name</span>
                            </label>
                            <input type="text" className="input input-bordered" placeholder="Your display name" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered"
                                placeholder="Tell us about yourself"
                            ></textarea>
                        </div>
                        <button className="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
