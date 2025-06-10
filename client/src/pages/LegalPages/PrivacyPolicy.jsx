const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-primary tracking-tight">Privacy Policy</h1>
                <p className="mt-4 text-base text-base-content/70 max-w-xl mx-auto">
                    We value your privacy and are committed to protecting your data. Here’s a transparent look at how we
                    collect and use information.
                </p>
            </div>

            <section className="space-y-6 bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-base-content">Information We Collect</h2>
                <ul className="list-disc list-inside text-base-content/80 space-y-2 ml-4">
                    <li>
                        <span className="font-medium">Personal Info:</span> Name, email address
                    </li>
                    <li>
                        <span className="font-medium">Activity Data:</span> App usage, actions, pages visited
                    </li>
                    <li>
                        <span className="font-medium">Cookies:</span> For session management & preferences
                    </li>
                </ul>
            </section>

            <section className="space-y-6 bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-base-content">How We Use Your Data</h2>
                <p className="text-base-content/80 leading-relaxed">
                    We use your information to enhance your user experience, provide technical support, and analyze
                    usage trends to improve our app. We never sell your data.
                </p>
            </section>

            <section className="space-y-6 bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-base-content">Your Rights</h2>
                <p className="text-base-content/80 leading-relaxed">
                    You have full control over your data. You may access, update, or delete your information at any time
                    by reaching out to our support team.
                </p>
            </section>

            <div className="text-center mt-12">
                <p className="text-sm text-base-content/50">Last updated: June 10, 2025</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
