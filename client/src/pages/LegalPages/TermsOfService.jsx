const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
            {/* Page Header */}
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-primary tracking-tight">Terms of Service</h1>
                <p className="mt-4 text-base text-base-content/70 max-w-xl mx-auto">
                    By using this application, you agree to the following terms. Please read them carefully.
                </p>
            </div>

            {/* Section: Usage Rules */}
            <section className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-2xl font-semibold text-base-content">Usage Rules</h2>
                <ul className="list-disc list-inside space-y-2 text-base-content/80">
                    <li>⚠️ You must not misuse or exploit the platform.</li>
                    <li>🛡️ You are responsible for activities conducted through your account.</li>
                    <li>🔧 Any attempt to disrupt or harm our service is strictly prohibited.</li>
                </ul>
            </section>

            {/* Section: Account Termination */}
            <section className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-2xl font-semibold text-base-content">Account Termination</h2>
                <p className="text-base-content/80">
                    We reserve the right to suspend or permanently terminate accounts found in violation of our
                    policies. Misuse or harmful behavior can lead to immediate deactivation without prior notice.
                </p>
            </section>

            {/* Section: Changes to Terms */}
            <section className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-2xl font-semibold text-base-content">Changes to Terms</h2>
                <p className="text-base-content/80">
                    Our terms may evolve as we improve our services. We will notify users of significant changes, but
                    continued use of our services indicates acceptance of the new terms.
                </p>
            </section>

            <div className="text-center text-sm text-base-content/50 pt-8">Last updated on June 6, 2025</div>
        </div>
    );
};

export default TermsOfService;
