import './profile.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Error_Page from '../error_page/error_page';
import { UserTable } from '../users_table/users_table';
import FilteredJob from '../filtered_job/filtered_job';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTags} from '@fortawesome/free-solid-svg-icons';
import { TagsProposals } from '../tags_proposals/tags_proposals';

/**
 * The profile component. It shows the user's profile with their files and information.
 * @returns The user's profile.
 */
function Profile() {
    const imageLink = "/3D_printer/Files/img/profile/default_profile.png";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {userId, username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);  
    const [showUserTable, setShowUserTable] = useState(false);
    const [showTagsProposals, setShowTagsProposals] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteJobState,setDeleteJobState] = useState(false);

    const handleCustomerSuggestion = () => {
        let customerName = document.getElementById("nc-name").value
        let customerMail = document.getElementById("nc-email").value
        let willReturn = false

        if(!isLogged){
            return
        }

        if(customerName == ""){
            alert("You must introduce a customer name")
            willReturn = true
        }
        if(customerMail == ""){
            alert("You must introduce the customer email")
            willReturn = true
        }

        if(willReturn){
            return
        }

        fetch('/3D_printer/3d_project/query.php',{
            method: 'POST',
            headers: {
                'Content-Type' : 'appliaction/json'
            },
            body: JSON.stringify({
                arg: 'newCustomer',
                admin: isAdmin,
                name: customerName,
                email: customerMail,
                phone: document.getElementById("nc-phone").value,
                desc: document.getElementById("nc-desc").value
            })
        })
    }

    const handleTagSuggestion = () => {
        let tagName = document.getElementById("new-tag-input").value

        if(!isLogged){
            return
        }

        if(tagName == ""){
            alert("You must introduce a tag name")
            return
        }

        console.log("PASA");

        fetch('/3D_printer/3d_project/query.php',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                arg: 'newTag',
                admin: isAdmin,
                name: tagName
            })
        }).then((response) => {
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        }).then((data) => {
            if(data){

            }
        })
    }
    
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
    const handleUsersClick = () => {
        if (isAdmin) {
            setShowUserTable(true)
        }
    };

    const handleTagsClick = () => {
        if (isAdmin) {
            setShowTagsProposals(true)
        }
    }

    const filteredResults = filteredItems.filter(item =>
        item.project_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * This function handles the click event on the delete jobs button
     * @param {e} Event of the click 
     */
    const handleDeleteButton = (e) => {
        e.target.classList.toggle("activated-btt")
        if(e.target.innerHTML == "Delete jobs"){
            e.target.innerHTML = "Cancel"
        }else{
            e.target.innerHTML = "Delete jobs"
        }
        setDeleteJobState(!deleteJobState);
    }

    const onDeleteJob = (id) => {
        setFilteredItems((prevItems) => prevItems.filter(item => item.id !== id));
    }

    return (
        <>
        {isLogged && (
            <div className="profile_page">
                <div className="profile_left_column">
                    <img className="profile_picture" src={imageLink} alt="" />
                    <h2 className="username_text">{username}</h2> 
                    <div className='admin_ctrl_panel'>
                        {isAdmin && (
                            <button className="profile_button" id="button1" onClick={handleUsersClick} title='Users'>
                                <FontAwesomeIcon icon={faUsers} />
                            </button>
                        )}
                        {isAdmin && (
                            <button className="profile_button" id="button1" onClick={handleTagsClick} title='Suggested tags'>
                                <FontAwesomeIcon icon={faTags} />
                            </button>
                        )}
                    </div>
                    <div className='suggestions'>
                        <div className='suggest-container'>
                            <b>Suggest new tag</b>
                            <div className='suggest-tag-input'>
                                <input id="new-tag-input" type='text' placeholder='new tag...'/>
                                <button onClick={handleTagSuggestion}>Suggest tag</button>
                            </div>
                        </div>
                        <div className='suggest-container'>
                            <b>Suggest new customer</b>
                            <form className='suggest-customer-form'>
                                <div>
                                    <label className="customer-name-lbl">Name</label>
                                    <input id="nc-name" type='text' placeholder='new customer name...'/>
                                </div>
                                <div>
                                    <label className='customer-email-lbl'>e-mail</label>
                                    <input id="nc-email" type='email' placeholder='new customer e-mail...'/>
                                </div>
                                <div>
                                    <label className='customer-phone-lbl'>Phone number</label>
                                    <input id="nc-phone" type='tel' placeholder='new customer phone...'/>
                                </div>
                                <div>
                                    <label className='customer-desc-lbl'>Description</label>
                                    <textarea id="nc-desc" placeholder='new customer description'/>
                                </div>
                                <button onClick={handleCustomerSuggestion}>Suggest customer</button>
                            </form>
                        </div>
                    </div>
                    
                    {showUserTable && <UserTable closeUserTable={() => setShowUserTable(false)} />}
                    {showTagsProposals && <TagsProposals closeUserTable={() => setShowTagsProposals(false)} />}
                </div>
                <div className="profile_jobs_section">
                    <div className="profile_jobs_section_header">
                        <h3 className="profile_jobs_section_title">Your files</h3>
                        <input
                            className='profile-search-project-name'
                            type="text"
                            placeholder="Search by project name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className='job-delete-btt' onClick={handleDeleteButton}>Delete jobs</div>
                    </div>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Error: {error.message}</p>
                        ) : filteredResults.length > 0 ? (
                            <div className="usr-jobs-list">
                                <ul className='usr-key'>
                                    <li></li>
                                    <li className='author'>Project</li>
                                    <li>Project date</li>
                                    <li>Layer thickness</li>
                                    <li>Weight</li>
                                    <li className='job_likes_key'></li>
                                </ul>
                                {filteredResults.map(item => (
                                    <FilteredJob
                                        key={item.id}
                                        id={item.id}
                                        name={item.project_name}
                                        job_user={item.username}
                                        creation_date={item.creation_date}
                                        img_format={item.img_format}
                                        likes={item.likes}
                                        layerthickness={item.layer_thickness}
                                        total_physical_weight={item.total_physical_weight}
                                        delete_mode={deleteJobState}
                                        onDeleteJob={onDeleteJob}
                                    />
                                ))}
                            </div>
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
