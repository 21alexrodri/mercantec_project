import React from "react";
import './signup.css';

export const Signup = ({closeSignup}) => {
    const handleContainerClick = (e) => {
        e.stopPropagation();
    };
    return (
        <div onClick={closeSignup} className="blur_content">
        <div onClick={handleContainerClick} className="signup_container">
        <h2>Signup</h2>
        <button onClick={closeSignup} className="close_signup">X</button>
        </div>
        </div>
    );
}