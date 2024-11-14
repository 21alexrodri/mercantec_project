import './tag-template.css'
import { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../context/UserContext';

/**
 * The template for the tags. It shows the jobs for each tag.
 * @param {jobs} jobs The jobs for the tags.
 * @param {tagId} tagId The id of the tag.
 * @param {tagName} tagName The name of the tag.
 * @param {handleShowJobs} handleShowJobs The function to show the jobs for a tag.
 * @returns 
 */
function TagTemplate({ jobs, tagId, tagName, handleShowJobs }) {
    const { isLogged } = useContext(UserContext);
    const { t } = useTranslation();
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); 
    const [direction, setDirection] = useState(null); 
    const jobsPerPage = 3; 
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();

    /**
     * This function handles the click on the next page arrow.
     */
    const handleNextPage = () => {
        const newOffset = ((currentPage + 1) * jobsPerPage);
        setOffset(newOffset);

        setDirection("left");
        setTimeout(() => {
            handleShowJobs(tagId, newOffset);
            setCurrentPage(prevPage => prevPage + 1);
            setDirection(null);
        }, 500);
    };

    /**
     * This function handles the click on the previous page arrow.
     */
    const handlePrevPage = () => {
        const newOffset = (offset - jobsPerPage);
        setOffset(newOffset);

        setDirection("right");
        setTimeout(() => {
            handleShowJobs(tagId, newOffset);
            setCurrentPage(prevPage => prevPage - 1);
            setDirection(null);
        }, 500);
    };

    const handleJobClick = (id) => {
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
                                {offset > 0 && (
                                    <FontAwesomeIcon className='arrow arrow-left' onClick={() => handlePrevPage(tagId, currentPage * jobsPerPage)} icon={faCaretLeft} />
                                )}
                                {jobs[tagId].jobs
                                    .filter(job => job.license === 0 || (job.license === 1 && isLogged))
                                    .map((job, i) => (
                                        <div key={i} className={`col ${direction === "left" ? "slide-left" : ""} ${direction === "right" ? "slide-right" : ""} `}>
                                            <div id={job.id} className='job-link' onClick={() => handleJobClick(job.id)}>
                                                {job.img_format != null ? (
                                                    <img className='job-content' src={`/3D_printer/Files/img/jobs/${job.id + job.img_format}`} alt="" />
                                                ) : (
                                                    <img className='job-content' src={'/3D_printer/Files/img/default-job.png'} alt="" />
                                                )}
                                            </div>
                                            <b>{job.project_name}</b><p>{job.username} - {job.creation_date}</p>
                                        </div>
                                    ))}
                                {jobs[tagId].count > (currentPage + 1) * jobsPerPage && (
                                    <FontAwesomeIcon className='arrow arrow-right' onClick={() => handleNextPage(tagId, currentPage * jobsPerPage)} icon={faCaretRight} />
                                )}
                            </>
                        ) : (
                            <p>{t("no_jobs")}</p>
                        )
                    ) : (
                        <p>{t("loading")}</p>
                    )}
                </div>
            </li>
        </>
    );
}

export default TagTemplate;
