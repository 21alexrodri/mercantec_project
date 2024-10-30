import './profile.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Error_Page from '../error_page/error_page';
import { UserTable } from '../users_table/users_table';
import FilteredJob from '../../filtered_job/filtered_job';

/**
 * The profile component. It shows the user's profile with their files and information.
 * @returns The user's profile.
 */
function Profile() {
    const imageLink = "/3D_printer/Files/img/default-job.png";
    const [recentsFirst, setRecentsFirst] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);  
    const [showUserTable, setShowUserTable] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        if (isLogged && username) {  
            setLoading(true);  
            fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ arg: 'getJobsByUsername', username }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setFilteredItems(data);
                    setLoading(false); 
                })
                .catch((error) => {
                    console.error('Error fetching categories:', error);
                    setError(error);
                    setLoading(false); 
                });
        }
    }, [username, isLogged]);
    
    /**
     * This function handles the click event on the edit button.
     */
    const handleEditClick = () => {
        if (isAdmin) {
            setShowUserTable(true)
        }
    };

    const filteredResults = filteredItems.filter(item =>
        item.project_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
        {isLogged && (
            <div className="profile_page">
                <div className="profile_left_column">
                    <img className="profile_picture" src={imageLink} alt="" />
                    <h2 className="username_text">{username}</h2> 
                    {isAdmin && (
                        <button className="profile_button" id="button1" onClick={handleEditClick}>
                            edit
                        </button>
                    )}
                    {showUserTable && <UserTable closeUserTable={() => setShowUserTable(false)} />}
                </div>
                <div className="profile_jobs_section">
                    <div className="profile_jobs_section_header">
                        <h3 className="profile_jobs_section_title">Your files</h3>
                        <input
                            type="text"
                            placeholder="Search by project name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Error: {error.message}</p>
                        ) : filteredResults.length > 0 ? (
                            filteredResults.map(item => (
                                <FilteredJob
                                    key={item.id}
                                    id={item.id}
                                    name={item.project_name}
                                    username={item.username}
                                    creation_date={item.creation_date}
                                    img_format={item.img_format}
                                    likes={item.likes}
                                    layerthickness={item.layer_thickness}
                                    total_physical_weight={item.total_physical_weight}
                                />
                            ))
                        ) : (
                            <p>No results found.</p>
                        )}
                    </div>
                </div>
            </div>
        )}
        {!isLogged && (
            <Error_Page />
        )}
        </>
    );
}

export default Profile;
