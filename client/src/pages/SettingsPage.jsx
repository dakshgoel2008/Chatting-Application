import React from "react";
import { useUserAuthStore } from "../store/userAuthStore";

const SettingsPage = () => {
    const { user } = useUserAuthStore();

    return <div>SettingsPage</div>;
};

export default SettingsPage;
