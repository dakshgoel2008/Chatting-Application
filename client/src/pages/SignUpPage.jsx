import React from "react";
import { useUserAuthStore } from "../store/userAuthStore";

const SignUpPage = () => {
    const { user } = useUserAuthStore();
    return <div>SignUpPage</div>;
};

export default SignUpPage;
