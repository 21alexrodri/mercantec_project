import { useCallback, useState, useEffect } from "react";
import "./users_table.css"

/**
 * 
 * @param { closeUserTable } the function to close the user table 
 * @returns A popup with a table to edit users. 
 */
export const UserTable = ({ closeUserTable }) => {
    const [search, setSearch] = useState('');
    const [usersList, setUsersList] = useState([]);
    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const escFunction = useCallback((event) => {
        if (event.key == "Escape") {
            closeUserTable();
        }
    });

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false); 
        };
    }, []);

    useEffect(() => {
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'getAllUsers'
            }),
            credentials: 'include',
        }).then(response => {
            return response.json();
        }
        ).then(data => {
            setUsersList(data);
        }).catch(error => {
            console.error('Error getting all users:', error);
        })
    }, []);

    return (
        <div onClick={closeUserTable} className="blur_content">
            <div onClick={handleContainerClick} id="users_table">
                <div className="popup_close">
                    <button onClick={closeUserTable}>X</button>
                </div>
                <div className="popup_title">
                    <h2>Edit Users</h2>
                </div>
                <div className="users_table_body">
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Admin</th>
                                <th>Email</th>
                                <th>Date Created</th>
                                <th>Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map((user, index) => {
                                return (
                                    <tr key={index} className={index % 2 === 0 ? 'color_a' : 'color_b'}>
                                        <td>{user.username}</td>
                                        <td>{user.is_admin === 1 ? 'Yes' : 'No'}</td>
                                        <td>{user.email}</td>
                                        <td>{user.date_created}</td>
                                        <td className={user.active ===1 ? 'user_active' : 'user_inactive'}><FontAwesomeIcon icon={faCircle} /></td>
                                    </tr>
                                );
                            }
                            )}
                        </tbody>
                    </table>
                    
                </div>
            </div>
        </div>
    );
};
