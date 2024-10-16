import './tag-template.css'
import { useEffect, useState } from 'react';

function TagTemplate({jobs,tagId,tagName,handleShowJobs}){
     
    let offset = 0;
    const [currentPage, setCurrentPage] = useState(0); // act job page
    const jobsPerPage = 4; // max visible jobs
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);

    // Functions created to handle job pages changes
    const handleNextPage = () => {
        offset = ((currentPage+1)*jobsPerPage)
        handleShowJobs(tagId,offset)
        console.log(offset)
        setCurrentPage(prevPage => prevPage + 1)
    };
    const handlePrevPage = () => {
        offset = offset - jobsPerPage
        handleShowJobs(tagId,offset)
        setCurrentPage(prevPage => prevPage + 1)
    };
    
    return (
        <>
            <li id={tagId} className="tag-content">
            <h2>{tagName}</h2>
            <div className='jobs-container'>
                    {jobs[tagId] ? (
                        
                        jobs[tagId].length > 0 ? (
                            <>
                                {(offset == 0) ? (
                                    <button className="arrow arrow-left" onClick={() => handlePrevPage()}>
                                        ←
                                    </button>
                                ) : (
                                    <></>
                                )}
                                {jobs[tagId].map((job, i) => (
                                    <div key={i} className='col'>
                                        <div className='job-content'>
                                            
                                        </div>
                                        <p>{job.project_name}</p>
                                    </div>
                                ))}
                                {((jobs[tagId].length > jobsPerPage*currentPage) && jobs[tagId].length>=4) ? (
                                    <button className="arrow arrow-right" onClick={() => handleNextPage(tagId,currentPage*jobsPerPage)}>
                                        →
                                    </button>
                                ) : (
                                    <></>
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