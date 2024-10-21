import { useCallback, useState, useEffect } from "react";

export const Login = ({ closeLogin }) => {
    const [dataSend, setDataSend] = useState({ username: '', password: '' });

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

    const send_data = () => {
        console.log("Datos enviados:", dataSend);
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'getUser',
                username: dataSend.username,
                password: dataSend.password
            }),
            credentials: 'include' // Esto asegura que las cookies de sesión se envíen
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            if (data.status === "success") {
                alert("Login successful");
                localStorage.setItem('userLoggedIn', true);
                localStorage.setItem('isAdmin', data.user.is_admin);
            } else {
                alert("Error: " + data.message);
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
                    <label htmlFor="username">Username</label><br />
                    <input type="text" name="username" value={dataSend.username} onChange={handleChange} autoFocus /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" name="password" value={dataSend.password} onChange={handleChange} /><br />
                    <br />
                    <input onClick={send_data} type="submit" value="LOG IN" className="credentials_submit_button" />
                </div>
            </div>
        </div>
    );
};
