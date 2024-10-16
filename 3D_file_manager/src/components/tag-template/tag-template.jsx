import './tag-template.css'
import { useEffect, useState } from 'react';

function TagTemplate({jobs,tagId,tagName,handleShowJobs}){
     
    const [offset,setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // act job page
    const jobsPerPage = 3; // max visible jobs
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);

    // DEBUGGING FUNCTION
    useEffect(() => {
        console.log('Offset ha cambiado:', offset);
    }, [offset]);

    // Functions created to handle job pages changes
    const handleNextPage = () => {
        let newOffset
        newOffset = ((currentPage+1)*jobsPerPage)
        
        setOffset(newOffset)
        handleShowJobs(tagId,newOffset)
        setCurrentPage(prevPage => prevPage + 1)
    };
    const handlePrevPage = () => {
        const newOffset = (offset - jobsPerPage)
        setOffset(newOffset)
        handleShowJobs(tagId,newOffset)
        setCurrentPage(prevPage => prevPage - 1)
    };
    
    return (
        <>
            <li id={tagId} className="tag-content">
            <h2>{tagName}</h2>
            <div className='jobs-container'>
                    {jobs[tagId] ? (
                        jobs[tagId].jobs.length > 0 ? (
                            <>
                                {(offset > 0) ? (
                                    <button className="arrow arrow-left" onClick={() => handlePrevPage()}>
                                        ←
                                    </button>
                                ) : (
                                    <></>
                                )}
                                {
                                    jobs[tagId].jobs.map((job, i) => (
                                        <div key={i} className='col'>
                                            <div className='job-content'>
                                                
                                            </div>
                                            <b>{job.id}</b><p>{job.project_name}</p>
                                        </div>
                                    ))
                                }
                                {
                                    jobs[tagId].count > (currentPage + 1) * jobsPerPage ? (
                                        <button className="arrow arrow-right" onClick={() => handleNextPage(tagId,currentPage*jobsPerPage)}>
                                            →
                                        </button>
                                    ) : (
                                        <></>
                                    )
                                }
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
    );
        
}

export default TagTemplate;