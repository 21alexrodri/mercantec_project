import './filtered_job.css'
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';
/**
 * A components to show all the jobs on the website as a list-view when a filter is applied
 * @param {id} the id of the job
 * @param {name} the name of the job
 * @param {job_user} the user who uploaded the job
 * @param {creation_date} the date when the job was uploaded
 * @param {img_format} the format of the image
 * @param {likes} the number of likes the job has
 * @param {license} the license of the job
 * @param {layerthickness} the thickness of the layer
 * @param {total_physical_weight} the total weight of the job
 * @param {delete_mode} the mode to delete the job
 * @param {onDeleteJob} the function to delete the job 
 * @returns A filtered job
 */
function FilteredJob({ id, name, job_user, creation_date, img_format, likes, license, layerthickness, total_physical_weight, delete_mode, onDeleteJob, ad }) {
    const { username, isAdmin, isLogged } = useContext(UserContext);
    const { t } = useTranslation();
    const [deleting, setDeleting] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const navigateTo = useNavigate();

    if (license === 1 && !isLogged) {
        return null;
    }

    const handleJobClick = (evt, id) => {
        if (evt.currentTarget.classList.contains("delete-enabled")) {
            setDeleting(true);
        } else {
            navigateTo('/job_page', { state: { jobId: id } });
        }
    };

    useEffect(() => {
        if (!delete_mode) {
            setDeleting(false);
        }
    }, [delete_mode]);

    /**
     * Deletes a job by its id
     * @param {id} the id of the job to be deleted 
     */
    const handleDeleteJob = (id) => {
        
        if (isAdmin || username === job_user) {
            setDeleted(true);
            setTimeout(() => {
                fetch('/3D_printer/3d_project/query.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        arg: 'deleteJobById',
                        id,
                        ad
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(() => {
                        onDeleteJob(id);
                    })
                    .catch(error => {
                        //console.log("ERROR: ", error);
                    });
            }, 1000);
        }
    };

    const handleDisableSelecting = () => {
        setDeleting(false);
    };

    return (
        <>
            {deleted ? (
                <div className="deleted-job" id={id}>
                    <p className="deleted-text">DELETED</p>
                </div>
            ) : (
                <>
                    {(deleting && delete_mode) ? (
                        <ul className="deleting-job" id={id}>
                            <b>{t("confirm_delete_job")} "{name}"?</b>
                            <div className='deleting-job-opts'>
                                <p className='yes' tabIndex="0" onKeyDown={(evt) => {
                                    if (evt.key === "Enter") {
                                        handleDeleteJob(id);
                                    }
                                }} onClick={() => handleDeleteJob(id)}>{t("delete")}</p>
                                <p className='no' tabIndex="0" onKeyDown={(evt) => {
                                    if (evt.key === "Enter") {
                                        handleDisableSelecting();
                                    }
                                }} onClick={() => handleDisableSelecting()}>{t("cancel")}</p>
                            </div>
                        </ul>
                    ) : (
                        <ul
                            className={`job-item-list ${(delete_mode ? "delete-enabled" : "")}`}
                            id={id}
                            onClick={(evt) => handleJobClick(evt, id)}
                            tabIndex="0"
                            onKeyDown={(evt) => {
                                if (evt.key === "Enter") {
                                    handleJobClick(evt, id);
                                }
                            }}
                        >
                            <li>
                                {img_format != null ? (
                                    <img
                                        className='job-content-list'
                                        src={`/3D_printer/Files/img/jobs/${id + img_format}`}
                                        alt=""
                                        onError={(e) => e.target.src = '/3D_printer/Files/img/default-job.png'}
                                    />
                                ) : (
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
                                <p className='job_weight' title='weight'>{(total_physical_weight).toFixed(2)}g</p>
                            </li>
                            <li className='likes_priv'>
                                <p className='job_likes' title='likes'><FontAwesomeIcon className='heart' icon={faHeart} ></FontAwesomeIcon><span className='likes_text'>{likes}</span></p>
                                {license === 1 && <p className='private_cell' title="This project is only visible for logged in users."><FontAwesomeIcon className='idCard' icon={faIdCard} /></p>}
                                {license === 0 && <p className='private_cell t_cell'><FontAwesomeIcon icon={faIdCard} /></p>}
                            </li>
                        </ul>
                    )}
                </>
            )}
        </>
    );
}

export default FilteredJob;
