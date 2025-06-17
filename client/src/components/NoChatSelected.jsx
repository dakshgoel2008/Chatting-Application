// just a better ui for frontpage thats it.😎
import { MessageSquare, Users, Zap, Shield, Heart } from "lucide-react";
import ChatLogo from "./ChatLogo";

const NoChatSelected = () => {
    const features = [
        {
            icon: <MessageSquare className="w-5 h-5" />,
            title: "Instant Messaging",
            description: "Send messages in real-time",
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Connect with Friends",
            description: "Stay connected with your contacts",
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Fast & Reliable",
            description: "Lightning-fast message delivery",
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Secure & Private",
            description: "Your conversations are protected",
        },
    ];

    return (
        <div className="w-full flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-br from-base-100 to-base-200/50 relative overflow-y-auto">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-2xl text-center space-y-8 relative z-10">
                {/* Animated Icon Display with ChatLogo */}
                <div className="flex justify-center gap-4 mb-8">
                    <div className="relative">
                        {/* Main icon with multiple animation layers */}
                        <div className="relative">
                            <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-primary/20 animate-ping"></div>
                            <div className="relative flex items-center justify-center group cursor-pointer">
                                <ChatLogo
                                    size="large"
                                    className="group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Welcome Text with enhanced styling */}
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Welcome to WhatsUp!
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-md mx-auto leading-relaxed">
                        Choose a conversation from the sidebar to start chatting with your friends and family
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-4 rounded-2xl bg-base-100/50 backdrop-blur-sm border border-base-300/50 hover:border-primary/30 hover:bg-base-100/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            style={{
                                animationDelay: `${index * 150}ms`,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300 group-hover:scale-110">
                                    <div className="text-primary group-hover:text-primary/80 transition-colors duration-300">
                                        {feature.icon}
                                    </div>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-primary">Ready to start chatting?</h3>
                    </div>
                    <p className="text-base-content/70 text-sm">
                        Select any contact from your sidebar to begin a conversation. Your messages are secure and
                        delivered instantly.
                    </p>
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-center gap-2 text-sm text-base-content/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Connected and ready</span>
                </div>
            </div>
        </div>
    );
};

export default NoChatSelected;
