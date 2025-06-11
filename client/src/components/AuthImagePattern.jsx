import React, { useState, useEffect } from "react";
import { Smartphone, Users, Shield, Clock, Zap, MessageCircle, Phone, Video, Share } from "lucide-react";
import ChatLogo from "./ChatLogo";
const EnhancedAuthComponent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [isConnecting, setIsConnecting] = useState(false);

    const features = [
        {
            icon: <MessageCircle className="w-8 h-8 text-blue-500" />,
            title: "Instant Messaging",
            description: "Lightning-fast messages with read receipts",
        },
        {
            icon: <Video className="w-8 h-8 text-green-500" />,
            title: "HD Video Calls",
            description: "Crystal clear video calls with up to 50 people",
        },
        {
            icon: <Share className="w-8 h-8 text-purple-500" />,
            title: "File Sharing",
            description: "Share photos, documents, and media instantly",
        },
        {
            icon: <Shield className="w-8 h-8 text-red-500" />,
            title: "End-to-End Encryption",
            description: "Your conversations are completely private",
        },
    ];

    const steps = [
        "Open WhatsUp on your phone",
        "Tap Menu → Linked Devices",
        "Scan the QR code below",
        "Start chatting on your computer!",
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % features.length);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 300);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const countdownTimer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 60));
        }, 1000);

        return () => clearInterval(countdownTimer);
    }, []);

    const handleConnect = () => {
        setIsConnecting(true);
        // Simulate connection process
        setTimeout(() => {
            setIsConnecting(false);
            alert("Demo: In a real app, this would initiate the QR scan process!");
        }, 2000);
    };

    const generateNewQR = () => {
        setCountdown(60);
        alert("Demo: New QR code generated!");
    };

    return (
        <div className="hidden lg:flex items-center justify-center px-10 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <ChatLogo className="w-12 h-12 text-green-500 mr-3" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            WhatsUp Web
                        </h1>
                    </div>
                    <p className="text-gray-600">Connect your phone to start messaging on your computer</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Side - Features */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Why use WhatsUp Web?</h3>

                        {/* Animated Feature Display */}
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-xl border border-blue-200/30 min-h-[120px] flex items-center">
                            <div
                                className={`transition-all duration-300 ${
                                    isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    {features[currentStep].icon}
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{features[currentStep].title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {features[currentStep].description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step-by-step Guide */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800">How to connect:</h4>
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center space-x-3 text-sm">
                                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </div>
                                    <span className="text-gray-700">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - QR Code */}
                    <div className="flex flex-col items-center space-y-6">
                        {/* QR Code Container */}
                        <div className="relative">
                            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-dashed border-gray-300">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://whatsup-web-demo.com/auth"
                                    alt="WhatsUp Web QR Code"
                                    className="w-48 h-48 rounded-lg"
                                />

                                {/* Scanning Animation Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-48 border-2 border-green-500 rounded-lg animate-pulse opacity-30"></div>
                                </div>
                            </div>

                            {/* Corner Decorations */}
                            <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-green-500 rounded-tl-lg"></div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-green-500 rounded-tr-lg"></div>
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-green-500 rounded-bl-lg"></div>
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-green-500 rounded-br-lg"></div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Code expires in {countdown}s</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={generateNewQR}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
                            >
                                Generate New Code
                            </button>
                            <button
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                            >
                                {isConnecting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Connecting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Smartphone className="w-4 h-4" />
                                        <span>Connect Phone</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Security Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="text-sm font-semibold text-blue-800">Secure Connection</span>
                            </div>
                            <p className="text-xs text-blue-700">
                                Your messages are end-to-end encrypted and never stored on our servers
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats/Features
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-green-600">2B+</div>
                            <div className="text-xs text-gray-600">Users Worldwide</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-blue-600">100+</div>
                            <div className="text-xs text-gray-600">Countries</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-purple-600">50+</div>
                            <div className="text-xs text-gray-600">Languages</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-red-600">24/7</div>
                            <div className="text-xs text-gray-600">Available</div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default EnhancedAuthComponent;
