const Support = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-primary tracking-tight">Support</h1>
                <p className="mt-4 text-base text-base-content/70 max-w-xl mx-auto">
                    Need help with your account or the app? We're here to assist with anything you need.
                </p>
            </div>

            {/* Contact Us Section */}
            <section className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-2xl font-semibold text-base-content">Contact Us</h2>
                <div className="space-y-2 text-base-content/80">
                    <p>
                        📧 Email:{" "}
                        <a href="mailto:support@example.com" className="text-primary underline">
                            support@example.com
                        </a>
                    </p>
                    <p>
                        📞 Phone: <span>+91 98765 43210</span>
                    </p>
                    <p>⏱️ Support Hours: 9:00 AM - 6:00 PM IST, Monday to Saturday (Not on Sundays😇)</p>
                </div>
            </section>

            {/* Common Topics Section */}
            <section className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-2xl font-semibold text-base-content">Common Topics</h2>
                <ul className="list-disc list-inside space-y-2 text-base-content/80">
                    <li>🔒 How to reset your password</li>
                    <li>🔔 Managing notification preferences</li>
                    <li>👤 Updating your profile details</li>
                    <li>🐞 Reporting bugs or issues in the app</li>
                </ul>
            </section>

            <div className="text-center pt-7 text-sm text-base-content/50">
                We aim to respond to all queries within 24 hours.
            </div>
        </div>
    );
};

export default Support;
