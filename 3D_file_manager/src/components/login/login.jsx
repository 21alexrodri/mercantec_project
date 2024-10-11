import React from "react";
import './login.css';

export const Login = ({closeLogin}) => {
    const handleContainerClick = (e) => {
        e.stopPropagation();
    };
    return (
        <div onClick={closeLogin} className="blur_content">
        <div onClick={handleContainerClick} className="login_container">
        <h2>Login</h2>
        <button onClick={closeLogin} className="close_login">X</button>
        </div>
        </div>
    );
}