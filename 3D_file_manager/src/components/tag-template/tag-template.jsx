import './tag-template.css'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight,} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function TagTemplate({jobs,tagId,tagName,handleShowJobs}){
    const [offset,setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // act job page
    const [direction, setDirection] = useState(null); // animation direction
    const jobsPerPage = 3; // max visible jobs
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();


    // Functions created to handle job pages changes
    const handleNextPage = () => {
        const newOffset = ((currentPage+1)*jobsPerPage) 
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

    const handleJobClick = (id) => {
        console.log(id);
        navigateTo('/job_page', { state: { jobId: id } });
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
                                            <div id={job.id} className='job-link' onClick={() => handleJobClick(job.id)}>
                                                <img className='job-content' src={`/3D_printer/Files/img/jobs/${job.id}.jpg`} onError={(e) => e.target.src = '/3D_printer/Files/img/default-job.png'} />
                                            </div>
                                            <b>{job.project_name}</b><p>{job.username} - {job.creation_date}</p>
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