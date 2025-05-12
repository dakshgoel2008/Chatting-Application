import React from "react";
import { useUserAuthStore } from './../store/userAuthStore';

const LoginPage = () => {
    const { user } = useUserAuthStore();

    return <div>LoginPage</div>;
};

export default LoginPage;
