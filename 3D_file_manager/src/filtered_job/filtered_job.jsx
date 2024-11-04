import './filtered_job.css'
import { useEffect, useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../context/UserContext';


function FilteredJob({id,name,job_user, creation_date,img_format, likes, layerthickness, total_physical_weight, delete_mode}) {
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);

    const [deleting,setDeleting] = useState(false);
    const navigateTo = useNavigate();

    const handleJobClick = (evt,id) => {
        if(evt.currentTarget.classList.contains("delete-enabled")){
            setDeleting(true)
        }else{
            navigateTo('/job_page', { state: { jobId: id } });
        }
    };

    useEffect(() => {
        if (!delete_mode) {
            setDeleting(false); // Resetear estado cuando delete_mode es false
        }
    }, [delete_mode]);

    const handleDeleteJob = (id)=> {
        console.log("Entra")
        // fetch('/3D_printer/3d_project/query.php', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ 
        //         arg: 'deleteJobById', 
        //         id
        //     }),
        // })
        // .then((response) => {
        //     console.log(response)
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     return response.json();
        // }).catch(error => {
        //     console.log("ERROR: ",error)
        // })
    }

    const handleDisableSelecting = () => {
        console.log("Entra disable")
        setDeleting(false)
    }

    return (
        <>
            {(deleting && delete_mode) ? (
                <>
                    <div className="deleting-job" id={id}>
                        <b>Are you sure you want to delete the job "{name}"?</b>
                        <div className='deleting-job-opts'>
                            <p className='yes' onClick={()=>handleDeleteJob(id)}>Delete</p>
                            <p className='no' onClick={()=>handleDisableSelecting()}>Cancel</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <ul className={`job-item-list ${(delete_mode) ? "delete-enabled" : ""}`} id={id} onClick={(evt)=>handleJobClick(evt,id)}>
                        <li>
                        {(
                            img_format!=null 
                        )?(
                            <img className='job-content-list'  src={`/3D_printer/Files/img/jobs/${id + img_format}`} alt="" />
                        ):(
                            <img className='job-content-list' src={'/3D_printer/Files/img/default-job.png'}></img>
                        )}
                        </li>
                        <li className='author'>
                            <p className='job_name'>{name}</p>
                            <p className='job_username'>{job_user}</p>
                        </li>
                        <li>
                            <p className='job_creation_date' title='creation date'>{creation_date}</p>
                        </li>
                        <li>
                        <p className='job_layerthickness' title='layer thickness'>{layerthickness}mm</p>
                        </li>
                        <li>
                        <p className='job_weight' title='weight'>{(total_physical_weight).toFixed(2)}kg</p>
                        </li>
                        <li>
                        <p className='job_likes' title='likes'><FontAwesomeIcon className='heart' icon={faHeart} ></FontAwesomeIcon><span className='likes_text'>{likes}</span></p>
                    </li>
            </ul>
                </>
            )}
        </>
    );
        
}

export default FilteredJob;