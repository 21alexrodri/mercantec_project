import { useCallback } from "react";

export const Signup = ({closeSignup}) => {
    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const escFunction = useCallback((event) => {
        if (event.key == "Escape") {
            closeSignup()
        }
    });
    document.addEventListener("keydown", escFunction, false);

    return (
        <div onClick={closeSignup} className="blur_content">
        <div onClick={handleContainerClick} className="credentials_popup_container">
        <div className="credentials_popup_close">
            <button onClick={closeSignup}>X</button>
        </div>
        <div className="credentials_title">
            <h2>Sign Up</h2>
        </div>
        <div className="credentials_body">
        <label htmlFor="">Email</label><br />
        <input type="text" autoFocus /><br />
        <label htmlFor="">Username</label><br />
        <input type="text" /><br />
        <label htmlFor="">Password</label><br />
        <input type="password" /><br />
        <br />
        <input type="submit" value="SIGN UP" className="credentials_submit_button" />
        </div>
        </div>
        </div>
    );
}