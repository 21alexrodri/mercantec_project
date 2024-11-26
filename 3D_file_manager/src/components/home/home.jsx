import './home.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useContext } from 'react';
import Filters from '../filters/filters'
import TagTemplate from '../tag-template/tag-template'
import { NewJob } from '../new_job/new_job';
import { UserContext } from '../../context/UserContext';
import FilteredJob from '../filtered_job/filtered_job';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faArrowDownShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const { t } = useTranslation();
    const [tags, setTags] = useState([]);
    const [jobs, setJobs] = useState({});
    const [filteredItems, setFilteredItems] = useState({})
    const [jobMenu, setNewJobMenu] = useState(false);
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [orderDirection, setOrderDirection] = useState('ASC'); 
    const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
    const [orderOption, setOrderOption] = useState('');
    const [deleteJobState,setDeleteJobState] = useState(false);

    const handleOrderSelection = (option) => {
        setOrderOption(option);
        setIsOrderDropdownOpen(false);
    };
    const toggleOrderDirection = () => {
        setOrderDirection(prevDirection => (prevDirection === 'ASC' ? 'DESC' : 'ASC'));
    };
    

    const handleFiltersAppliedChange = (newFiltersApplied) => {
        setFiltersApplied(newFiltersApplied);
    };

    const getAppliedFiltersCount = () => {
        let count = 0;
        for (const key in filtersApplied) {
            const value = filtersApplied[key];
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    count += 1;
                }
            } else if (value !== '') {
                count += 1;
            }
        }
        return count;
    };

    const appliedFiltersCount = getAppliedFiltersCount();

    useEffect(() => {
        const appliedFiltersCount = getAppliedFiltersCount();
        if (appliedFiltersCount >= 1) {
            fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    arg: "getFilteredItems",
                    textname: filtersApplied.textname,
                    date: filtersApplied.date,
                    tags: filtersApplied.tags,
                    color: filtersApplied.color,
                    customer: filtersApplied.customer,
                    material: filtersApplied.material,
                    maxlayerthickness: filtersApplied.maxlayerthickness,
                    minlayerthickness: filtersApplied.minlayerthickness,
                    order: orderOption,
                    orderDirection: orderDirection
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setFilteredItems(data);
                // console.log("resultado: ");
                // console.log(filteredItems);
            })
            .catch(error => {
                console.error('Error fetching filtered items:', error);
            });
        }
    }, [filtersApplied, orderOption, orderDirection]); 
    

    const handleShowTags = () => {
        setLoading(true); 
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ arg: "getTags" })
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

    async function handleShowJobs(tagId, offset) {
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
                    is_logged: isLogged
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
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
            // console.log(jobs)
        }
    }, [tags]);

    useEffect(()=>{
        if(appliedFiltersCount>=1){
            document.querySelector("#home main").style.overflow = "visible"
        }else{
            document.querySelector("#home main").style.overflow = "hidden"
        }
    },[appliedFiltersCount])

    const handleDeleteButton = (e) => {
        e.target.classList.toggle("activated-btt")
        if(e.target.classList.contains("activated-btt")){
            e.target.innerHTML = t("cancel_del_jobs")
        }else{
            e.target.innerHTML = t("del_jobs")
        }
        setDeleteJobState(!deleteJobState);
    }

    const onDeleteJob = (id) => {
        setFilteredItems((prevItems) => prevItems.filter(item => item.id !== id));
    }

    return (
        <>
            <div id='home'>
                <Filters onFiltersAppliedChange={handleFiltersAppliedChange} />
                <main>
                    {jobMenu && <NewJob closeNewJob={() => setNewJobMenu(false)} tags={tags}/>}
                    {appliedFiltersCount >= 1 ? (
                        <div>
                            <div className='hp_searchedheader'>
                                <h2 className='hp_searchedfiles'>{t('searched_files')}</h2>
                                    
                                    <div className='order-controls'>
                                    
                                        <div className='order' onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}>
                                            <FontAwesomeIcon icon={faSort} /> <p className='order-by-text'>{t("order_by")}</p>
                                            
                                                <ul className="order-dropdown">
                                                    <li onClick={() => handleOrderSelection('name')}>{t("name")}</li>
                                                    <li onClick={() => handleOrderSelection('username')}>{t("username")}</li>
                                                    <li onClick={() => handleOrderSelection('date')}>{t("date")}</li>
                                                    <li onClick={() => handleOrderSelection('likes')}>{t("likes")}</li>
                                                    <li onClick={() => handleOrderSelection('layerthickness')}>{t("layer_thickness")}</li>
                                                    <li onClick={() => handleOrderSelection('weight')}>{t("weight")}</li>
                                                </ul>
                                            
                                        </div>
                                        <button className='order-direction-button' onClick={toggleOrderDirection}>
                                            {orderDirection === 'ASC' ? <FontAwesomeIcon icon={faArrowDownShortWide} /> : <FontAwesomeIcon icon={faArrowDownWideShort} />}
                                        </button>
                                        {(isAdmin) ? (<div className='job-delete-btt' onClick={handleDeleteButton}>{t("del_jobs")}</div>) : (<></>)}
                                    </div>
                                    
                            </div>
                            <div>
                            {filteredItems.length > 0 ? (
                                <>
                                    <ul className='usr-key'>
                                        <li></li>
                                        <li className='author'>{t("project")}</li>
                                        <li>{t("project")} {t("date")}</li>
                                        <li>{t("layer_thickness")}</li>
                                        <li>{t("weight")}</li>
                                        <li className='job_likes_key'></li>
                                    </ul>
                                    {filteredItems.map(item => (
                                        <FilteredJob
                                        key={item.id}
                                        id={item.id}
                                        name={item.project_name}
                                        job_user={item.username}
                                        creation_date={item.creation_date}
                                        img_format={item.img_format}
                                        likes={item.likes}
                                        license={item.license}
                                        layerthickness={item.layer_thickness}
                                        total_physical_weight={item.total_physical_weight}
                                        delete_mode={deleteJobState}
                                        onDeleteJob={onDeleteJob}
                                        />
                                    ))}
                                </>
                                
                            ) : (
                                <p>{t("no_results")}</p>
                            )}
                        </div>
                    </div>
                    ) : (
                        <div>
                        {tags.length > 0 ? (
                            <ul className="tags-list">
                                {tags.map((tag, index) => (
                                    <TagTemplate 
                                        key={tag.id} 
                                        jobs={jobs} 
                                        tagId={tag.id} 
                                        tagName={tag.name_tag}
                                        handleShowJobs={handleShowJobs}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p>{t("no_tags")}</p> 
                        )}
                    </div>
                    )}
                </main>
                {isLogged && (
                    <div onClick={() => setNewJobMenu(true)} id="upload-button">
                        <p>+</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;
