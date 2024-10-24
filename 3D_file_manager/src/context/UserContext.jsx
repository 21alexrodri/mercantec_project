// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();
/**
 * The provider for the user context. It provides the username, isAdmin, and isLogged states to the children components.
 */
export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState("guest");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await fetch('/3D_printer/3d_project/query.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        arg: 'checkUserLoggedIn'
                    }),
                    credentials: 'include',
                });

                const text = await response.text();

                if (text.trim() === "") {
                    throw new Error("No answer");
                }

                const data = JSON.parse(text);
                if (data.status === "success") {
                    setUsername(data.username || "guest");
                    setIsAdmin(data.is_admin === 1);
                    setIsLogged(true);
                } else {
                    setUsername("guest");
                    setIsAdmin(false);
                    setIsLogged(false);
                }
            } catch (error) {
                console.error('Error checking user status:', error);
                setUsername("guest");
                setIsAdmin(false);
            }
        };

        checkUserStatus();
    }, []);

    return (
        <UserContext.Provider value={{ username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged }}>
            {children}
        </UserContext.Provider>
    );
};
