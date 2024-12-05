import { useCallback, useState, useEffect, useContext } from "react";
import "./tags_proposals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import FilteredJob from "../filtered_job/filtered_job";
import { Popup } from "../popup_message/popup_message";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../../context/UserContext";
/**
 * Admin's table to manage tags.
 * @param {closeUserTable} it closes the table 
 * @returns The tags proposals table
 */
export const TagsProposals = ({ closeUserTable }) => {

    const [tagsList, setTagsList] = useState([])
    const { t } = useTranslation();
    const [filteredList, setFilteredTags] = useState([])
    const [updateTagList, setUpdateTagList] = useState(false)
    const [loading, setLoading] = useState(true)
    const { userId, username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);
    const [showPopup, setShowPopup] = useState(false)

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    /**
     * Handles the action of the admin on the tag
     * @param {id} the id of the tag 
     * @param {action} the action to be done
     * @returns The action to be done
     */
    const handleTagAction = (id, action) => {

        if (!isAdmin) {
            return
        }

        setLoading(true)

        fetch("/3D_printer/3d_project/query.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'modifyTags',
                id: id,
                action: action
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error("ERROR modifying tags")
            }

            setUpdateTagList(!updateTagList);
            setLoading(false)
        })
            .catch(error => {
                setShowPopup(true)

                setTimeout(() => setShowPopup(false), 3000);
                console.error("Error modifying tags: ", error)
                setLoading(false)
            })
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            closeUserTable();
        }
    }, [closeUserTable]);

    const handleSearch = (e) => {
        const value = e.target.value
        setFilteredTags(tagsList.filter(tag => tag.name_tag.toLowerCase().includes(value)))
    }

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    /**
     * Gets the unaccepted tags from the server
     */
    useEffect(() => {
        setLoading(true)

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
                setLoading(false)
            })
            .catch(error => {
                console.error('Error getting unaccepted tags:', error);
                setLoading(false)
            });
    }, [, updateTagList]);

    const sortTagsList = () => {
        setFilteredTags([...tagsList].sort((a, b) => a.accepted - b.accepted));
    };

    useEffect(() => {
        sortTagsList();
    }, [tagsList]);

    return (
        <div onClick={closeUserTable} className="blur_content">
            <div onClick={handleContainerClick} id="suggested_tags_table">
                <div className="popup_close">
                    <button onClick={closeUserTable}>X</button>
                </div>
                <div className="popup_title">
                    <h2>{t("edit-tags")}</h2>
                </div>
                <div className="suggested_tags_table_body">
                    <input
                        onChange={handleSearch}
                        type="text"
                        placeholder={t("search-tag")}
                        className="suggested_tags_table_searchbar"
                    />
                    <div className="tags_table_results_container">
                        {loading ? (
                            <p className="loading-txt">Loading...</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t("tag-name")}</th>
                                        <th>{t("actions")}</th>
                                    </tr>
                                </thead>
                                <tbody className="tags_table_body">
                                    {filteredList.map((tag, index) => (
                                        <tr
                                            key={index}
                                            className={tag.accepted == 0 ? "to-accept" : "accepted"}
                                            title={tag.accepted == 0 ? "To accept" : "Accepted"}
                                        >
                                            <td>{tag.name_tag}</td>
                                            {tag.accepted == 0 ? (
                                                <td>
                                                    <button onClick={() => { handleTagAction(tag.id, "decline") }} className="decline">{t("decline")}</button>
                                                    <button onClick={() => { handleTagAction(tag.id, "accept") }} className="accept">{t("accept")}</button>
                                                </td>
                                            ) : (
                                                <td>
                                                    <button onClick={() => { handleTagAction(tag.id, "disable") }} className="disable">{t("disable")}</button>
                                                    <button onClick={() => { handleTagAction(tag.id, "delete") }} className="delete">{t("delete")}</button>
                                                </td>
                                            )
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                    </div>
                    <div className="legend">
                        <span>
                            <FontAwesomeIcon className="blue-legend" icon={faCircle} />
                            <p>{t("edit-tags-legend-blue")}</p>
                        </span>
                        <span>
                            <FontAwesomeIcon className="white-legend" icon={faCircle} />
                            <p>{t("edit-tags-legend-white")}</p>
                        </span>
                    </div>
                </div>
            </div>
            {showPopup && (
            <Popup message="Error deleting tag. No job must use this tag before deleting it." status="warning" />
            )}
        </div>
        
    );
};
