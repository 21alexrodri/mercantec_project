import './home.css';
import { useEffect, useState } from 'react';
import Filters from '../filters/filters'

function Home() {
    const [tags, setTags] = useState([]); 
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 

    const handleShowTags = () => {
        console.log("show tags")
        setLoading(true); 
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({arg: "getTags"})
        }
    )
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); 
            })
            .then(data => {
                console.log("Tags: "+data)
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

    const handleShowJobs = () => {
        console.log("show jobs")
        setLoading(true)
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({arg: "getJobs"})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
            console.log("Jobs: "+data)
            setJobs(data)
            setError(null)
        })
        .catch(error => {
            console.error('Error:', error);
            setError(error.message); 
        })
        .finally(() => {
            setLoading(false)
        })
    }

    // When the component is loaded, executes queries to load information
    useEffect(() => {
        handleShowJobs();
        handleShowTags();
    }, []);

    return (
        <div className="main_block">
        <Filters />
        <div className="home">
            <h2>Home</h2>
        
            <div>
                {tags.length > 0 ? (
                    <ul className="tags-list">
                        {tags.map((tag, index) => (
                            
                            <li id={tag.id} className="tag-content" key={index}>
                                <h2>{tag.name_tag}</h2>
                                <div className='jobs-container'>
                                {jobs.map((job, jobIndex) => {
                                    if (job["name_tag"] === tag.name_tag) {
                                        return (
                                            <div className="job-content" key={jobIndex}>
                                                {/* Aquí puedes agregar más detalles del trabajo */}
                                                <p>{job.project_name}</p>
                                            </div>
                                        );
                                    }
                                    return null;  // Si no hay coincidencia, devuelve null para no renderizar nada
                                })}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tags to show</p> 
                )}
            </div>
        </div>
        </div>
    );
}

export default Home;
