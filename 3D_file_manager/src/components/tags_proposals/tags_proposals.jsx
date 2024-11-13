import { useCallback, useState, useEffect, act } from "react";
import "./tags_proposals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import FilteredJob from "../filtered_job/filtered_job";

export const TagsProposals = ({ closeUserTable }) => {

    const [tagsList,setTagsList] = useState([])
    const [filteredList,setFilteredTags] = useState([])

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
                arg: 'getUnacceptedTags'
            }),
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            setTagsList(data);
            setFilteredTags(data);
        })
        .catch(error => {
            console.error('Error getting unaccepted tags:', error);
        });
    }, []);

    return (
        <div onClick={closeUserTable} className="blur_content">
            <div onClick={handleContainerClick} id="suggested_tags_table">
                <div className="popup_close">
                    <button onClick={closeUserTable}>X</button>
                </div>
                <div className="popup_title">
                    <h2>Edit Tags</h2>
                </div>
                <div className="suggested_tags_table_body">
                    <input 
                        type="text" 
                        placeholder="Search tag..."
                        className="suggested_tags_table_searchbar"
                    />
                    <div className="tags_table_results_container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tag name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="tags_table_body">
                                {filteredList.map((tag,index) => (
                                    <tr 
                                        key={index} 
                                        className={tag.accepted == 0 ? "to-accept" : "accepted"}
                                        title={tag.accepted == 0 ? "To accept" : "Accepted"}
                                    >
                                        <td>{tag.name_tag}</td>
                                        {tag.accepted == 0 ? (
                                            <td>
                                                <button className="decline">Decline</button>
                                                <button className="accept">Accept</button>
                                            </td>
                                        ) : (
                                            <td>
                                                <button className="disable">Disable</button>
                                                <button className="delete">Delete</button>
                                            </td>
                                        )
                                    }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>  
                    <p className="">Hola</p> 
                </div>
            </div>
        </div>
    );
};
