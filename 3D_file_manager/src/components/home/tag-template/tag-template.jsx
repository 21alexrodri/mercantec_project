import './tag-template.css'
import { useEffect, useState } from 'react';

function TagTemplate({jobs,tagId,tagName,handleShowJobs}){
     
    const [currentPage, setCurrentPage] = useState(0); // act job page
    const jobsPerPage = 4; // max visible jobs
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);

    // Functions created to handle job pages changes
    const handleNextPage = () => {
        const newOffset = (currentPage+1)*jobsPerPage - 4
        handleShowJobs(tagId,newOffset)
    };
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };
    
    return (
        <>
            <li id={tagId} className="tag-content">
            <h2>{tagName}</h2>
            <div className='jobs-container'>
                    {jobs[tagId] ? (
                        
                        jobs[tagId].length > 0 ? (
                            <>
                                {(
                                    <button className="arrow arrow-left" onClick={() => handlePrevPage()}>
                                        ←
                                    </button>
                                )}
                                {jobs[tagId].map((job, i) => (
                                    <div key={i} className='col'>
                                        <div className='job-content'>
                                            
                                        </div>
                                        <p>{job.project_name}</p>
                                    </div>
                                ))}
                                {(
                                    <button className="arrow arrow-right" onClick={() => handleNextPage(tagId,currentPage*jobsPerPage)}>
                                        →
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>No jobs</p> 
                        )
                    ) : (
                        <p>Loading jobs...</p>
                    )}
                    
            </div>
        </li>
        </>
    )
        
}

export default TagTemplate;