import { useCallback, useState, useEffect, act } from "react";
import "./users_table.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
export const UserTable = ({ closeUserTable }) => {
    const [search, setSearch] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { t } = useTranslation();

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const changeUserState = (id, active) => {
        console.log("AL PRESIONAR ESTÁ: "+active)

        const newActiveState = active == 1 ? 0 : 1;

        console.log("MÁS TARDE ESTARÁ: "+newActiveState)
    
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
            if (data.status === 'success') {
                setUsersList(prevUsersList => 
                    prevUsersList.map(user => 
                        user.id === id ? { ...user, active: newActiveState } : user
                    )
                );
    
                setFilteredUsers(prevFilteredUsers => 
                    prevFilteredUsers.map(user => 
                        user.id === id ? { ...user, active: newActiveState } : user
                    )
                );
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
                    <h2>{t("edit_users")}</h2>
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
                                    <th>{t("username")}</th>
                                    <th>{t("admin")}</th>
                                    <th>{t("email")}</th>
                                    <th>{t("date")} {t("created")}</th>
                                    <th>{t("active")}</th>
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
                                            onClick={() => {
                                                changeUserState(user.id, user.active);
                                            }} 
                                            className={user.active == 1 ? 'user_active' : 'user_inactive'} 
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
