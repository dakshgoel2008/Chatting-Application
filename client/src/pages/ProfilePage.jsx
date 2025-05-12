import React from "react";
import { useUserAuthStore } from "../store/userAuthStore";

const ProfilePage = () => {
    const { user } = useUserAuthStore();

    return <div>ProfilePage</div>;
};

export default ProfilePage;
