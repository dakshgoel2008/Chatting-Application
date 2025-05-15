import React, { useEffect } from "react";
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
const App = () => {
    const { user, checkAuth, isCheckingAuth } = useUserAuthStore();
    // check if the user is logged in or not
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
            // lucide-react//
        );
    }

    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={user ? <HomePage /> : <Navigate to="/login"></Navigate>} />
                <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/"></Navigate>} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/"></Navigate>} />
                <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login"></Navigate>} />
                <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login"></Navigate>} />
            </Routes>
            <Toaster />
        </>
    );
};

export default App;
