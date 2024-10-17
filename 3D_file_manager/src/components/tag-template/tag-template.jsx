import './tag-template.css'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight,} from '@fortawesome/free-solid-svg-icons';

function TagTemplate({jobs,tagId,tagName,handleShowJobs}){
     
    const [offset,setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // act job page
    const [direction, setDirection] = useState(null); // animation direction
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

        setDirection("left")
        setTimeout(()=>{
            handleShowJobs(tagId,newOffset)
            setCurrentPage(prevPage => prevPage + 1)
            setDirection(null)
        },500)
    };
    const handlePrevPage = () => {
        const newOffset = (offset - jobsPerPage)
        setOffset(newOffset)

        setDirection("right")
        setTimeout(()=>{
            handleShowJobs(tagId,newOffset)
            setCurrentPage(prevPage => prevPage - 1)
            setDirection(null)
        },500)
        
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
                                    <FontAwesomeIcon className='arrow arrow-left' onClick={() => handlePrevPage(tagId,currentPage*jobsPerPage)} icon={faCaretLeft} />
                                ) : (
                                    <></>
                                )}
                                {
                                    jobs[tagId].jobs.map((job, i) => (
                                        <div key={i} className={`col ${direction==="left" ? "slide-left" : ""} ${direction==="right" ? "slide-right" : ""} `}>
                                                <div className='job-content'>
                                                <a href={`job_page?jobId=${job.id}`}/>

                                                </div>
                                            <b>{job.id}</b><p>{job.project_name}</p>
                                        </div>
                                    ))
                                    
                                }
                                {
                                    jobs[tagId].count > (currentPage + 1) * jobsPerPage ? (
                                            <FontAwesomeIcon className='arrow arrow-right' onClick={() => handleNextPage(tagId,currentPage*jobsPerPage)} icon={faCaretRight} />
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