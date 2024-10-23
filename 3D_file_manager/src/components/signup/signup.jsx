import { useCallback, useState, useEffect } from "react";

/**
 * The signup component. It is a popup that appears when the user clicks on the signup button.
 * @param {closeSignup} the function to close the signup popup 
 * @returns A popup with a form to sign up.
 */
export const Signup = ({ closeSignup }) => {
    const [dataSend, setDataSend] = useState({ email: '', username: '', password: '' });

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
    const send_data = () => {
        console.log("Datos enviados:", dataSend);
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
                console.log('Response:', data); 
                if (data.status === "success") {
                    alert("User created successfully");
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching:', error);
            });
        
    };

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
                    <label htmlFor="email">Email</label><br />
                    <input type="text" name="email" value={dataSend.email} onChange={handleChange} autoFocus /><br />
                    <label htmlFor="username">Username</label><br />
                    <input type="text" name="username" value={dataSend.username} onChange={handleChange} /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" name="password" value={dataSend.password} onChange={handleChange} /><br />
                    <br />
                    <input onClick={send_data} type="submit" value="SIGN UP" className="credentials_submit_button" />
                </div>
            </div>
        </div>
    );
};
