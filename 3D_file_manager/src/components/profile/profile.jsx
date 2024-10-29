import './profile.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Error_Page from '../error_page/error_page';
import {UserTable } from  '../users_table/users_table';
/**
 * The profile component. It shows the user's profile with their files and information.
 * @returns The user's profile.
 */
function Profile() {
    const imageLink = "/3D_printer/Files/img/default-job.png";
    const [recentsFirst, setRecentsFirst] = useState(false);
    const [buttonText, setButtonText] = useState("⯆ recents first");
    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);  
    const [showUserTable, setShowUserTable] = useState(false);

    /**
     * This function changes the order of the jobs in the profile.
     */
    function changeOrder() {
        setRecentsFirst(!recentsFirst);
        setButtonText(recentsFirst ? "⯆ recents first" : "⯅ olders first ");
    }
    /**
     * This function fetches the tags from the backend and sets the tags state.
     */
    const handleShowTags = () => {
        setLoading(true);
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ arg: "getTags" }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTags(data);
                setError(null);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    /**
     * This function fetches the jobs for a specific tag from the backend and sets the jobs state.
     * @param {tagId}  
     * @param {offset} 
     */
    async function handleShowJobs(tagId, offset) {
        console.log("show jobs");
        setLoading(true);

        try {
            const response = await fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    arg: "getJobs",
                    tag_id: tagId,
                    offset: offset,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Jobs:", data);
            setJobs(prevJobs => ({
                ...prevJobs,
                [tagId]: data,
            }));
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    
    useEffect(() => {
        handleShowTags();
    }, []);

    
    useEffect(() => {
        if (tags.length > 0) {
            tags.forEach(tag => {
                handleShowJobs(tag.id, 0);
            });
        }
    }, [tags]);

    /**
     * This function handles the click event on the edit button.
     */
    const handleEditClick = () => {
        if (isAdmin) {
            setShowUserTable(true)
        }
    };

    return (
        <>
        {isLogged &&(
        <div className="profile_page">
            <div className="profile_left_column">
                <img className="profile_picture" src={imageLink} alt="" />
                <h2 className="username_text">{username}</h2> 
                {isAdmin &&(
                <button className="profile_button" id="button1" onClick={handleEditClick}>
                    edit
                </button>
                )}
            
                {showUserTable && <UserTable closeUserTable={() => setShowUserTable(false)} />}
            </div>
            <div className="profile_jobs_section">
                <div className="profile_jobs_section_header">
                    <h3 className="profile_jobs_section_title">Your files</h3>
                    <button className="profile_button" id="button2" onClick={changeOrder}>
                        {buttonText}
                    </button>
                </div>
                {getJobs()}
            </div>
        </div>
    )}
        {!isLogged &&(
        <Error_Page />
    )}
    
    </>
    );
}

export default Profile;
