import React from "react";
import { useUserAuthStore } from './../store/userAuthStore';
const NavBar = () => {
    const { user } = useUserAuthStore();
    return (
        <>
            <div>NavBar</div>
        </>
    );
};

export default NavBar;
