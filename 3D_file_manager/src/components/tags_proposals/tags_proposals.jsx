import { useCallback, useState, useEffect, act } from "react";
import "./tags_proposals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

export const TagsProposals = ({ closeUserTable }) => {

    const handleContainerClick = (e) => {
        e.stopPropagation();
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
            <div onClick={handleContainerClick} id="suggested_tags_table">
                <div className="popup_close">
                    <button onClick={closeUserTable}>X</button>
                </div>
                <div className="popup_title">
                    <h2>Tags Proposals</h2>
                </div>
                <div className="suggested_tags_table_body">
                    <input 
                        type="text" 
                        placeholder="Search tag..."
                        className="suggested_tags_table_searchbar"
                    />
                </div>
            </div>
        </div>
    );
};
