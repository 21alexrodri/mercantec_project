import "./login.css";
import { useCallback, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
/**
 * The login component. It is a popup that appears when the user clicks on the login button.
 * @param {closeLogin} closeLogin The function to close the login popup. 
 * @returns A popup with a form to log in.
 */
export const Login = ({ closeLogin }) => {
    const [dataSend, setDataSend] = useState({ username: '', password: '' });
    const [wrongData, setWrongData] = useState(false);

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const escFunction = useCallback((event) => {
        if (event.key == "Escape") {
            closeLogin();
        }
    });

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false); 
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataSend((prevData) => ({
            ...prevData,
            [name]: value 
        }));
    };

    /**
     * This function sends the user's credentials to the server to log in.
     */
    const send_data = (event) => {
        event.preventDefault()
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'getUser',
                username: dataSend.username,
                password: dataSend.password
            }),
            credentials: 'include' 
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            if (data.status === "success") {
                localStorage.setItem('userLoggedIn', true);
                localStorage.setItem('isAdmin', data.user.is_admin);
                window.location.reload();
            } else {
                setWrongData(true);
                document.getElementById("password_prompt").focus();
            }
        })
        .catch(error => {
            console.error('Error fetching:', error);
        });
    };
 

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
                    <form id="login_form" onSubmit={send_data}>
                    <label htmlFor="username">Username</label><br />
                    <input id="username_prompt" type="text" name="username" value={dataSend.username} onChange={handleChange} autoFocus /><br />
                    <label htmlFor="password">Password</label><br />
                    <input id="password_prompt" type="password" name="password" value={dataSend.password} onChange={handleChange} /><br />
                    <br />
                    <input type="submit" value="LOG IN" className="credentials_submit_button" />
                    {wrongData &&(
                        <p className="err_msg">Invalid username, invalid password or user not activated</p>
                    )}
                    </form>
                </div>
            </div>
        </div>
    );
};
