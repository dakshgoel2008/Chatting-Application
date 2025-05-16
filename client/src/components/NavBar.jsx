import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useUserAuthStore } from "../store/userAuthStore";

const NavBar = () => {
    const { user, logOut } = useUserAuthStore();

    return (
        <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left side */}
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">WhatsUp</h1>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/settings"
                        className="btn btn-sm flex items-center gap-2 text-gray-700 hover:text-white transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline text-white">Settings</span>
                    </Link>

                    {user && (
                        <>
                            <Link
                                to="/profile"
                                className="btn btn-sm flex items-center gap-2 text-gray-700 hover:text-white transition-colors"
                            >
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline text-white">Profile</span>
                            </Link>

                            <button
                                onClick={logOut}
                                className="btn btn-sm flex items-center gap-2 text-gray-700 hover:text-white transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline text-white">Logout</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NavBar;
