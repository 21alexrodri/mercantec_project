import { useCallback } from "react";
import './login.css';

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
        <div onClick={handleContainerClick} className="login_container">
        <div className="close_login">
            <button onClick={closeLogin}>X</button>
        </div>
        <div className="credentials_title">
            <h2>Login</h2>
        </div>
        <div className="credentials_body">
        <label htmlFor="">Username</label><br />
        <input type="text" autoFocus /><br />
        <label htmlFor="">Password</label><br />
        <input type="password" /><br />
        <br />
        <input type="submit" value="LOG IN" className="login_button" />
        </div>
        </div>
        </div>
    );
}