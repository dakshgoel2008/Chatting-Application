const About = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">About</h3>
                <p className="text-sm text-base-content/70">App information and support</p>
            </div>

            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <h4 className="card-title">Chat App</h4>
                    <p className="text-sm text-base-content/70">Version 1.0.0</p>
                    <div className="card-actions justify-start mt-4">
                        <button className="btn btn-outline">Support</button>
                        <button className="btn btn-outline">Privacy Policy</button>
                        <button className="btn btn-outline">Terms of Service</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
