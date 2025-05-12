import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";
import { useUserAuthStore } from "./store/userAuthStore";
import { Loader } from "lucide-react";
const App = () => {
    const { user, checkAuth, isCheckAuth } = useUserAuthStore();
    console.log(user);
    useEffect(() => {
        // check if the user is logged in or not
        checkAuth();
    }, [checkAuth]);
    console.log(user);
    if (!isCheckAuth) {
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
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </>
    );
};

export default App;
