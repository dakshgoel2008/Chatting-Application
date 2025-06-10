import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">About</h3>
                <p className="text-sm text-base-content/70">App information and support</p>
            </div>

            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <h4 className="card-title">WhatsUp</h4>
                    <p className="text-sm text-base-content/70">Version 1.0.0</p>
                    <div className="card-actions justify-start mt-4">
                        <button className="btn btn-outline" onClick={() => navigate("/support")}>
                            Support
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate("/privacy-policy")}>
                            Privacy Policy
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate("/terms-of-service")}>
                            Terms of Service
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
