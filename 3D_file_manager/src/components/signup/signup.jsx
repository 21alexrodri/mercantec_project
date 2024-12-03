
import { useCallback, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./signup.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Popup } from '../popup_message/popup_message';
/**
 * The signup component. It is a popup that appears when the user clicks on the signup button.
 * @param {closeSignup} the function to close the signup popup 
 * @returns A popup with a form to sign up.
 */
export const Signup = ({ closeSignup, onUserCreated }) => {
    const { t } = useTranslation();
    const [dataSend, setDataSend] = useState({ email: '', username: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [showPopup, setShowPopup] = useState(false);
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
        event.preventDefault();
        if (showPopup) return;

        if (dataSend.email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataSend.email)) {
            setShowPopup(true);
            setErrorMsg('Invalid email format');
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }
        if (!/^[a-zA-Z0-9_-]{3,20}$/.test(dataSend.username)) {
            setShowPopup(true);
            setErrorMsg('Invalid username format');
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }
        if (dataSend.password.length < 8) {
            setShowPopup(true);
            setErrorMsg('Password must be at least 8 characters long');
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }

        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'insertUser',
                email: dataSend.email,
                username: dataSend.username,
                password: dataSend.password,
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
                    onUserCreated();
                    closeSignup();
                } else {
                    setShowPopup(true);
                    setErrorMsg(data.message);
                    setTimeout(() => setShowPopup(false), 3000);
                    focusInput();
                }
            })
            .catch((error) => {
                setShowPopup(true);
                setErrorMsg("Error " + error + ". Please try again later.");
                setTimeout(() => setShowPopup(false), 3000);
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
                    <h2>{t("sign_up")}</h2>
                </div>
                <div className="credentials_body">
                    <form id="signup_form" onSubmit={send_data}>
                        <label className="username-lbl" htmlFor="email">{t("email")}
                            <span className="tooltip-container">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    {t("rules_signup")}<br /> <br />
                                    <FontAwesomeIcon icon={faCaretRight} /> {t("spacebar")}<br />
                                    <FontAwesomeIcon icon={faCaretRight} /> {t("special_char")} &lt;, &gt;, ", '... {t("exception_char")}<br />
                                    <FontAwesomeIcon icon={faCaretRight} /> {t("min_char")}
                                </span>
                            </span>
                        </label>
                        <input id="email_prompt" type="text" name="email" value={dataSend.email} onChange={handleChange} autoFocus /><br />
                        <label htmlFor="username">{t("username")}</label><br />
                        <input id="username_prompt" type="text" name="username" value={dataSend.username} onChange={handleChange} /><br />
                        <label htmlFor="password">{t("password")}</label><br />
                        <input id="password_prompt" type="password" name="password" value={dataSend.password} onChange={handleChange} /><br />
                        <br />
                        <input type="submit" value="SIGN UP" className="credentials_submit_button" />
                        {showPopup && (
                            <Popup message={errorMsg} status="warning" />
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};