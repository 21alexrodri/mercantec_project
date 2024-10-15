import { useCallback } from "react";

export const Login = ({closeLogin}) => {
    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const escFunction = useCallback((event) => {
        if (event.key == "Escape") {
            closeLogin()
        }
    });
    document.addEventListener("keydown", escFunction, false);

    return (
        <div onClick={closeLogin} className="blur_content">
        <div onClick={handleContainerClick} className="credentials_popup_container">
        <div className="credentials_popup_close">
            <button onClick={closeLogin}>X</button>
        </div>
        <div className="credentials_title">
            <h2>Log In</h2>
        </div>
        <div className="credentials_body">
        <label htmlFor="">Username</label><br />
        <input type="text" autoFocus /><br />
        <label htmlFor="">Password</label><br />
        <input type="password" /><br />
        <br />
        <input type="submit" value="LOG IN" className="credentials_submit_button" />
        </div>
        </div>
        </div>
    );
}