import './home.css';
import { useEffect, useState } from 'react';
import Filters from '../filters/filters'
import TagTemplate from '../tag-template/tag-template'
import { NewJob } from '../new_job/new_job';

function Home() {
    const [tags, setTags] = useState([]);
    const [jobs, setJobs] = useState({});
    const [jobMenu,setNewJobMenu] = useState(false);
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 

    const handleShowTags = () => {
        setLoading(true); 
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ arg: "getTags" })
        }
        )
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

    // When the component is loaded, executes queries to load information
    useEffect(() => {
        handleShowTags();
    }, []);

    // When tags are updated, update jobs for each tag
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
                <Filters />
                <main>
                    {jobMenu && <NewJob closeNewJob={() => setNewJobMenu(false)}/>}
                    <div>
                        {tags.length > 0 ? (
                            <ul className="tags-list">
                                {tags.map((tag, index) => (
                                    <TagTemplate 
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
                </main>
                <div onClick={()=>setNewJobMenu(true)} id="upload-button">
                    <p>+</p>
                </div>
            </div>
        </>
    );
}

export default Home;
