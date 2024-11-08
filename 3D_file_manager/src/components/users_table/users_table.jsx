import { useCallback, useState, useEffect, act } from "react";
import "./users_table.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

export const UserTable = ({ closeUserTable }) => {
    const [search, setSearch] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const changeUserState = (id, active) => {

        console.log(active)

        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'changeUserState',
                id: id,
                active: active
            }),
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.status === 'success') {
                console.log("ENTRA: "+active)
                const updatedUsersList = usersList.map(user => 
                    user.id === id ? { ...user, active: active === 1 ? 0 : 1 } : user
                );
                setUsersList(updatedUsersList);
                setFilteredUsers(updatedUsersList.filter(user => 
                    user.username.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase())
                ));
            } else {
                console.error('Error changing user state:', data.message);
            }
        })
        .catch(error => {
            console.error('Error changing user state:', error);
        });
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredUsers(usersList.filter(user => 
            user.username.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value)
        ));
    };

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            closeUserTable();
        }
    }, [closeUserTable]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false); 
        };
    }, [escFunction]);

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
        })
        .then(response => response.json())
        .then(data => {
            setUsersList(data);
            setFilteredUsers(data);
        })
        .catch(error => {
            console.error('Error getting all users:', error);
        });
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
                    <input 
                        type="text" 
                        value={search} 
                        onChange={handleSearch} 
                        placeholder="Search by username or email..."
                        className="users_table_searchbar"
                    />
                    <div className="users_table_results_container">
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
                                {filteredUsers.map((user, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'color_a' : 'color_b'}>
                                        <td>{user.username}</td>
                                        <td>{user.is_admin === 1 ? 'Yes' : 'No'}</td>
                                        <td>{user.email}</td>
                                        <td>{user.date_created}</td>
                                        <td 
                                            id={user.id} 
                                            className={user.active == 1 ? 'user_active' : 'user_inactive'} 
                                            onClick={() => {
                                                changeUserState(user.id, user.active);
                                            }} 
                                            title={user.active == 1 ? 'User Enabled' : 'User Disabled'}
                                        >
                                            <FontAwesomeIcon icon={faCircle} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
