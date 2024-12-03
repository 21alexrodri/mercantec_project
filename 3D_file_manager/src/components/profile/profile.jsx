import './profile.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Home from '../home/home';
import { UserTable } from '../users_table/users_table';
import FilteredJob from '../filtered_job/filtered_job';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTags, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { TagsProposals } from '../tags_proposals/tags_proposals';
import { CustomersProposals } from '../customers_proposals/customers_proposals';
import { useTranslation } from 'react-i18next';

/**
 * The profile component. It shows the user's profile with their files and information.
 * @returns The user's profile.
 */
function Profile() {
    const imageLink = "/3D_printer/Files/img/profile/default_profile.png";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { userId, username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);
    const [showUserTable, setShowUserTable] = useState(false);
    const [showTagsProposals, setShowTagsProposals] = useState(false);
    const [showCustomersProposals, setShowCustomersProposals] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteJobState, setDeleteJobState] = useState(false);
    const { t } = useTranslation();

    /**
     * This function handles the suggestion of a new customer
     * @returns The new customer suggestion
     */
    const handleCustomerSuggestion = () => {
        let customerName = document.getElementById("nc-name").value
        let customerMail = document.getElementById("nc-email").value
        let willReturn = false

        if (!isLogged) {
            return
        }

        if (customerName == "") {
            alert("You must introduce a customer name")
            willReturn = true
        }
        if (customerMail == "") {
            alert("You must introduce the customer email")
            willReturn = true
        }

        if (willReturn) {
            return
        }

        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'appliaction/json'
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

    /**
     * This function handles the suggestion of a new tag
     * @returns The new tag suggestion
     */
    const handleTagSuggestion = () => {
        let tagName = document.getElementById("new-tag-input").value

        if (!isLogged) {
            return
        }

        if (tagName == "") {
            alert("You must introduce a tag name")
            return
        }


        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                arg: 'newTag',
                admin: isAdmin,
                name: tagName
            })
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        }).then((data) => {
            if (data) {

            }
        })
    }
    /**
     * This function fetches the jobs of the user when the component mounts.
     */
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

    const handleCustomersClick = () => {
        if (isAdmin) {
            setShowCustomersProposals(true)
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
        if (e.target.classList.contains("activated-btt")) {
            e.target.innerHTML = t("cancel_del_jobs")
        } else {
            e.target.innerHTML = t("del_jobs")
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
                            {isAdmin && (
                                <button className="profile_button" id="button1" onClick={handleCustomersClick} title='Suggested tags'>
                                    <FontAwesomeIcon icon={faBuilding} />
                                </button>
                            )}
                        </div>
                        <div className='suggestions'>
                            <div className='suggest-container'>
                                <b>{t("suggest_new_tag")}</b>
                                <div className='suggest-tag-input'>
                                    <input id="new-tag-input" type='text' placeholder={t("new_tag")} />
                                    <button onClick={handleTagSuggestion}>{t("suggest_tag")}</button>
                                </div>
                            </div>
                            <div className='suggest-container'>
                                <b>{t("suggest_new_customer")}</b>
                                <form className='suggest-customer-form'>
                                    <div>
                                        <label className="customer-name-lbl">{t("name")}</label>
                                        <input id="nc-name" type='text' placeholder={t("new_customer_name")} />
                                    </div>
                                    <div>
                                        <label className='customer-email-lbl'>{t("email")}</label>
                                        <input id="nc-email" type='email' placeholder={t("new_customer_email")} />
                                    </div>
                                    <div>
                                        <label className='customer-phone-lbl'>{t("phone_number")}</label>
                                        <input id="nc-phone" type='tel' placeholder={t("new_customer_phone")} />
                                    </div>
                                    <div>
                                        <label className='customer-desc-lbl'>{t("description")}</label>
                                        <textarea id="nc-desc" placeholder={t("new_customer_description")} />
                                    </div>
                                    <button onClick={handleCustomerSuggestion}>{t("suggest_customer_submit")}</button>
                                </form>
                            </div>
                        </div>

                        {showUserTable && <UserTable closeUserTable={() => setShowUserTable(false)} />}
                        {showTagsProposals && <TagsProposals closeUserTable={() => setShowTagsProposals(false)} />}
                        {showCustomersProposals && <CustomersProposals closeUserTable={() => setShowCustomersProposals(false)} />}
                    </div>
                    <div className="profile_jobs_section">
                        <div className="profile_jobs_section_header">
                            <h3 className="profile_jobs_section_title">{t("your_files")}</h3>
                            <input
                                className='profile-search-project-name'
                                type="text"
                                placeholder={t("search")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className='job-delete-btt' tabIndex="0" onClick={handleDeleteButton} onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleDeleteButton(e);
                                }
                            }}>{t("delete_jobs")}</div>
                        </div>
                        <div>
                            {loading ? (
                                <p>{t("loading")}</p>
                            ) : error ? (
                                <p>Error: {error.message}</p>
                            ) : filteredResults.length > 0 ? (
                                <div className="usr-jobs-list">
                                    <ul className='usr-key'>
                                        <li></li>
                                        <li className='author'>{t("project")}</li>
                                        <li>{t("project_date")}</li>
                                        <li>{t("layer_thickness")}</li>
                                        <li>{t("weight")}</li>
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
                                <p>{t("no_results")}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {!isLogged && (
                <Home />
            )}
        </>
    );
}

export default Profile;
