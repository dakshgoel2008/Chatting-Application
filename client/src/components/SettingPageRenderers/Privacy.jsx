const Privacy = () => {
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
                    <button className="btn btn-secondary">Change Password</button>
                    <button className="btn btn-error">Delete Account</button>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
