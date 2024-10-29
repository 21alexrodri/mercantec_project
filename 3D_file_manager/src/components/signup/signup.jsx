import { useCallback, useState, useEffect } from "react";
import "./signup.css";
/**
 * The signup component. It is a popup that appears when the user clicks on the signup button.
 * @param {closeSignup} the function to close the signup popup 
 * @returns A popup with a form to sign up.
 */
export const Signup = ({ closeSignup }) => {
    const [dataSend, setDataSend] = useState({ email: '', username: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const escFunction = useCallback((event) => {
        if (event.key == "Escape") {
            closeSignup();
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataSend((prevData) => ({
            ...prevData,
            [name]: value 
        }));
    };

    /**
     * This function sends the user's credentials to the server to sign up.
     */
    const send_data = (event) => {
        event.preventDefault()
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'insertUser',
                email: dataSend.email,
                username: dataSend.username,
                password: dataSend.password
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    alert("User created successfully");
                    closeSignup();
                } else {
                    setErrorMsg(data.message);
                    focusInput()
                }
            })
            .catch((error) => {
                setErrorMsg("Error: " + error + ". Please try again later.");
            });
        
    };

    const focusInput = () => {
        switch (true) {
            case document.getElementById("email_prompt").value == "":
                document.getElementById("email_prompt").focus();
                break;
            default:
                document.getElementById("username_prompt").focus();
                break;
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false); 
        };
    }, []);

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
                    <form id="signup_form" onSubmit={send_data}>
                    <label htmlFor="email">Email</label><br />
                    <input id="email_prompt" type="text" name="email" value={dataSend.email} onChange={handleChange} autoFocus /><br />
                    <label htmlFor="username">Username</label><br />
                    <input id="username_prompt" type="text" name="username" value={dataSend.username} onChange={handleChange} /><br />
                    <label htmlFor="password">Password</label><br />
                    <input id="password_prompt" type="password" name="password" value={dataSend.password} onChange={handleChange} /><br />
                    <br />
                    <input type="submit" value="SIGN UP" className="credentials_submit_button" />
                    {errorMsg != "" ? <p className="error_message">{errorMsg}</p> : ""}
                    </form>
                </div>
            </div>
        </div>
    );
};
