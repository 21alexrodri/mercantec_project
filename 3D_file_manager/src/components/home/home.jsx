import './home.css';
import { useEffect, useState, useContext } from 'react';
import Filters from '../filters/filters'
import TagTemplate from '../tag-template/tag-template'
import { NewJob } from '../new_job/new_job';
import { UserContext } from '../../context/UserContext';

function Home() {
    const [tags, setTags] = useState([]);
    const [jobs, setJobs] = useState({});
    const [filteredItems, setFilteredItems] = useState({})
    const [jobMenu, setNewJobMenu] = useState(false);
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);
    const [filtersApplied, setFiltersApplied] = useState([]);

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
        if(appliedFiltersCount >= 1){
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
                    minlayerthickness: filtersApplied.minlayerthickness
                })
            })
            .then(response => {
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setFilteredItems(data);
                console.log("resultado: ");
                console.log(filteredItems);
            })
            .catch(error => {
                console.error('Error fetching filtered items:', error);
            });
        }
    }, [filtersApplied]);

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
                    offset: offset
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
            console.log(jobs)
        }
    }, [tags]);

    return (
        <>
            <div id='home'>
                <Filters onFiltersAppliedChange={handleFiltersAppliedChange} />
                <main>
                    {jobMenu && <NewJob closeNewJob={() => setNewJobMenu(false)} tags={tags}/>}
                    {appliedFiltersCount >= 1 ? (
                        <>
                        <h2 className='hp_searchedfiles'>Searched files.</h2>
                        <div>
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <div key={item.id}>
                                        <p>{item.project_name} por {item.username}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No se encontraron resultados.</p>
                            )}
                        </div>
                    </>
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
                            <p>No tags to show</p> 
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
