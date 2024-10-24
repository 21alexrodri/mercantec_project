import './filtered_job.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function FilteredJob({id,name,username, creation_date,img_format, likes, layerthickness, total_physical_weight}) {
    const [offset,setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); 
    const [direction, setDirection] = useState(null); 
    const jobsPerPage = 3; 
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();

   
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
    /**
     * This function handles the click on the previous page arrow.
     */
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
        navigateTo('/job_page', { state: { jobId: id } });
    };
    
    return (
        <>
           <div className='job-item-list' id={id}>
            {(
               img_format!=null 
            )?(
                <img className='job-content-list'  src={`/3D_printer/Files/img/jobs/${id + img_format}`} alt="" />
            ):(
                <img className='job-content-list' src={'/3D_printer/Files/img/default-job.png'}></img>
            )}
            <div className='author'>
            <p className='job_name'>{name}</p>
            <p className='job_username'>{username}</p>
            </div>
            <p className='job_creation_date' title='creation date'>{creation_date}</p>
            <p className='job_layerthickness' title='layer thickness'>{layerthickness}mm</p>
            <p className='job_weight' title='weight'>{(total_physical_weight).toFixed(2)}kg</p>
            <p className='job_likes' title='likes'><FontAwesomeIcon className='heart' icon={faHeart} ></FontAwesomeIcon><span className='likes_text'>{likes}</span></p> 
           </div>
        </>
    );
        
}

export default FilteredJob;