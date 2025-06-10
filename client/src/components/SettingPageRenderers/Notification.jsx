const Notification = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Notification Settings</h3>
                <p className="text-sm text-base-content/70">Control your notification preferences</p>
            </div>

            <div className="card bg-base-100 shadow-sm">
                <div className="card-body space-y-4">
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Message Notifications</span>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Sound Notifications</span>
                            <input type="checkbox" className="toggle toggle-primary" />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Desktop Notifications</span>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
