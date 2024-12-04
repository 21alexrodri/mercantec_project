import { useCallback, useState, useEffect } from "react";
import "./users_table.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

/**
 * Admin's table to manage users.
 * @param {closeUserTable} it closes the table 
 * @returns The users table
 */
export const UserTable = ({ closeUserTable }) => {
    const [search, setSearch] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { t } = useTranslation();

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    /**
     * This function changes the state of the user.
     * @param {id} the id of the user 
     * @param {active} the state of the user
     */
    const changeUserState = (id, active) => {
        const newActiveState = active == 1 ? 0 : 1;

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
                            String(user.id) === String(id) ? { ...user, active: newActiveState } : user
                        )
                    );

                    setFilteredUsers(prevFilteredUsers =>
                        prevFilteredUsers.map(user =>
                            String(user.id) === String(id) ? { ...user, active: newActiveState } : user
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

    /**
     * This function toggles the admin state of the user.
     * @param {id} the id of the user 
     * @param {admin} the state of the user 
     */
    const toggleAdmin = (id, admin) => {
        const newAdminState = admin == 1 ? 0 : 1;

        fetch("/3D_printer/3d_project/query.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'toggleAdmin',
                id: id,
            }),
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUsersList(prevUsersList =>
                        prevUsersList.map(user =>
                            String(user.id) === String(id) ? { ...user, is_admin: newAdminState } : user
                        )
                    );

                    setFilteredUsers(prevFilteredUsers =>
                        prevFilteredUsers.map(user =>
                            String(user.id) === String(id) ? { ...user, is_admin: newAdminState } : user
                        )
                    );
                }
            })
            .catch(error => {
                console.error('Error getting all users:', error);
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
                // Inicializamos isDeleted y confirmDelete en false para todos los usuarios
                const usersWithFlags = data.map(user => ({ ...user, isDeleted: false, confirmDelete: false }));
                setUsersList(usersWithFlags);
                setFilteredUsers(usersWithFlags);
            })
            .catch(error => {
                console.error('Error getting all users:', error);
            });
    }, []);

    const handleDeleteUserAction = (id) => {
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'deleteUserById',
                id: id
            }),
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                // Marcamos el usuario como eliminado y reiniciamos confirmDelete
                setUsersList(prevUsersList =>
                    prevUsersList.map(user =>
                        String(user.id) === String(id) ? { ...user, isDeleted: true, confirmDelete: false } : user
                    )
                );

                setFilteredUsers(prevFilteredUsers =>
                    prevFilteredUsers.map(user =>
                        String(user.id) === String(id) ? { ...user, isDeleted: true, confirmDelete: false } : user
                    )
                );
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    const handleDeleteClick = (id) => {
        const userToDelete = usersList.find(user => String(user.id) === String(id));
        if (userToDelete && userToDelete.confirmDelete) {
            // Si confirmDelete es true, procedemos a eliminar
            handleDeleteUserAction(id);
        } else {
            // Si no, establecemos confirmDelete en true
            setUsersList(prevUsersList =>
                prevUsersList.map(user =>
                    String(user.id) === String(id) ? { ...user, confirmDelete: true } : user
                )
            );
            setFilteredUsers(prevFilteredUsers =>
                prevFilteredUsers.map(user =>
                    String(user.id) === String(id) ? { ...user, confirmDelete: true } : user
                )
            );
        }
    };

    const handleCancelDelete = (id) => {
        // Reiniciamos confirmDelete a false
        setUsersList(prevUsersList =>
            prevUsersList.map(user =>
                String(user.id) === String(id) ? { ...user, confirmDelete: false } : user
            )
        );
        setFilteredUsers(prevFilteredUsers =>
            prevFilteredUsers.map(user =>
                String(user.id) === String(id) ? { ...user, confirmDelete: false } : user
            )
        );
    };

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
                                    <th>{t("email")}</th>
                                    <th>{t("date")} {t("created")}</th>
                                    <th>{t("active")}</th>
                                    <th>{t("admin")}</th>
                                    <th>{t("delete")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => {
                                    if (user.isDeleted) {
                                        return null; // No renderizamos la fila si el usuario está eliminado
                                    }
                                    return (
                                        <tr
                                            key={user.id}
                                            className={index % 2 === 0 ? 'color_a' : 'color_b'}
                                        >
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.date_created}</td>
                                            <td
                                                id={user.id}
                                                tabIndex="0"
                                                onClick={() => {
                                                    changeUserState(user.id, user.active);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        changeUserState(user.id, user.active);
                                                    }
                                                }}
                                                className={user.active == 1 ? 'user_active' : 'user_inactive'}
                                                title={user.active == 1 ? 'User Enabled' : 'User Disabled'}
                                            >
                                                <FontAwesomeIcon icon={faCircle} />
                                            </td>
                                            <td
                                                id={user.id}
                                                tabIndex="0"
                                                onClick={() => {
                                                    toggleAdmin(user.id, user.is_admin);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        toggleAdmin(user.id, user.is_admin);
                                                    }
                                                }}
                                                className={user.is_admin == 1 ? 'user_active' : 'user_inactive'}
                                                title={user.is_admin == 1 ? 'Admin user' : 'Non admin user'}
                                            >
                                                <FontAwesomeIcon icon={faCircle} />
                                            </td>
                                            <td>
                                                {user.confirmDelete ? (
                                                    <>
                                                        <button onClick={() => handleDeleteClick(user.id)} className="confirm-btn">
                                                            {t("confirm")}
                                                        </button>
                                                        <button onClick={() => handleCancelDelete(user.id)} className="cancel-btn">
                                                            {t("cancel")}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleDeleteClick(user.id)} className="delete-btn">
                                                        {t("delete")}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
