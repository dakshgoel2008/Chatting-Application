import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";
import { useUserAuthStore } from "./store/userAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Support from "./pages/LegalPages/Support";
import PrivacyPolicy from "./pages/LegalPages/privacyPolicy";
import TermsOfService from "./pages/LegalPages/TermsOfService";

const App = () => {
    const { user, checkAuth, isCheckingAuth, onlineUsers } = useUserAuthStore();
    const [navbarPosition, setNavbarPosition] = useState("left");

    // check if the user is logged in or not
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Listen for navbar position changes
    useEffect(() => {
        const savedPosition = localStorage.getItem("navbar-position");
        if (savedPosition) {
            setNavbarPosition(savedPosition);
        }

        // Listen for storage changes (when user toggles position)
        const handleStorageChange = () => {
            const newPosition = localStorage.getItem("navbar-position") || "left";
            setNavbarPosition(newPosition);
        };

        window.addEventListener("storage", handleStorageChange);

        // Also listen for custom event for same-tab changes
        window.addEventListener("navbar-position-changed", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("navbar-position-changed", handleStorageChange);
        };
    }, []);

    if (isCheckingAuth && !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    console.log("onlineUsers:", onlineUsers);

    return (
        <div className="h-screen overflow-hidden">
            {/* Show navbar only for authenticated routes */}
            {<NavBar />}

            {/* Main content area with proper spacing */}
            <div
                className={`h-full transition-all duration-300 ${
                    user ? (navbarPosition === "right" ? "mr-20" : "ml-20") : ""
                }`}
            >
                <Routes>
                    <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
                    <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />

                    {/* LegalPages */}
                    <Route path="/support" element={<Support />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                </Routes>
            </div>

            <Toaster />
        </div>
    );
};

export default App;
