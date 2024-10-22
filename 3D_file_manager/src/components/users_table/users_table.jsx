import { useCallback, useState, useEffect } from "react";
import "./users_table.css"

export const UserTable = ({ closeUserTable }) => {
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

    const handleChange = (e) => {
        console.log("Ø")
    };

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
                    <input type="text" className="users_table_searchbar" name="username" placeholder="search" onChange={handleChange} autoFocus />
                    <div className="users_table_results_container">
                        <div className="result color_a"><span> User 1 </span></div>
                        <div className="result color_b"><span> User 2 </span></div>
                        <div className="result color_a"><span> User 3 </span></div>
                        <div className="result color_b"><span> User 4 </span></div>
                        <div className="result color_a"><span> User 5 </span></div>
                        <div className="result color_b"><span> User 6 </span></div>
                        <div className="result color_a"><span> User 7 </span></div>
                        <div className="result color_b"><span> User 8 </span></div>
                        <div className="result color_a"><span> User 9 </span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
