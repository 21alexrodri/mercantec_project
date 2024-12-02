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
function TagTemplate({ jobs, tagId, tagName, handleShowJobs, loadingJobs }) {
    const { isLogged } = useContext(UserContext);
    const { t } = useTranslation();
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(null);
    const jobsPerPage = 3;
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeoutFinished, setTimeoutFinished] = useState(false);
    const navigateTo = useNavigate();

    const [displayedJobs, setDisplayedJobs] = useState(jobs[tagId]?.jobs || []);

    /**
     * Esta función maneja el clic en la flecha de la siguiente página.
     */
    const handleNextPage = () => {
        const newOffset = ((currentPage + 1) * jobsPerPage);
        setDirection("left");
        setLoading(true);
        handleShowJobs(tagId, newOffset);

        setTimeout(() => {
            setOffset(newOffset);
            setCurrentPage(prevPage => prevPage + 1);
            setLoading(false);
            setDirection(null);

            if (jobs[tagId]?.jobs) {
                setDisplayedJobs(jobs[tagId].jobs);
            }
        }, 500);
    };

    /**
     * Esta función maneja el clic en la flecha de la página anterior.
     */
    const handlePrevPage = () => {
        const newOffset = (offset - jobsPerPage);
        setDirection("right");
        setLoading(true);

        handleShowJobs(tagId, newOffset);

        setTimeout(() => {
            setOffset(newOffset);
            setCurrentPage(prevPage => prevPage - 1);
            setLoading(false);
            setDirection(null);
            if (jobs[tagId]?.jobs) {
                setDisplayedJobs(jobs[tagId].jobs);
            }
        }, 500);
    };

    const handleJobClick = (id) => {
        navigateTo('/job_page', { state: { jobId: id } });
    };

    useEffect(() => {
        if (!loadingJobs) {
            console.log("ACABA DE CARGAR");
            setTimeoutFinished(false);
            // Solo actualizamos displayedJobs si no estamos animando
            if (direction === null && jobs[tagId]?.jobs) {
                setDisplayedJobs(jobs[tagId].jobs);
            }
        }
    }, [loadingJobs, timeoutFinished, jobs, tagId, direction]);

    return (
        <>
            <li id={tagId} className="tag-content">
                <h2>{tagName}</h2>
                <div className='jobs-container'>
                    {jobs[tagId] ? (
                        jobs[tagId].jobs.length > 0 ? (
                            <>
                                {offset > 0 && !loading && !loadingJobs && (
                                    <FontAwesomeIcon className='arrow arrow-left' onClick={() => handlePrevPage()} icon={faCaretLeft} tabIndex="0" onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handlePrevPage();
                                        }
                                    }} />
                                )}
                                {
                                    (
                                        offset == 0
                                    ) ? (
                                        <>
                                            <div className='col'>
                                                <div className='job-link'>
                                                    <img className='job-content'></img>
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='job-link'>
                                                    <img className='job-content'></img>
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='job-link'>
                                                    <img className='job-content'></img>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                {
                                    displayedJobs
                                        .filter(job => job.license === 0 || (job.license === 1 && isLogged))
                                        .map((job, i) => {
                                            const isVisible = i >= offset && i < offset + jobsPerPage; 
                                            return (
                                                <div
                                                    key={job.id}
                                                    className={`col ${(direction === "left") ? "slide-left" : ""} ${direction === "right" ? "slide-right" : ""}`}
                                                >
                                                    <div
                                                        id={job.id}
                                                        className='job-link'
                                                        onClick={() => handleJobClick(job.id)}
                                                        tabIndex={isVisible ? "0" : "-1"} 
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleJobClick(job.id);
                                                            }
                                                        }}
                                                    >
                                                        {job.img_format != null ? (
                                                            <img
                                                                className='job-content'
                                                                src={`/3D_printer/Files/img/jobs/${job.id + job.img_format}`}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <img
                                                                className='job-content'
                                                                src={'/3D_printer/Files/img/default-job.png'}
                                                                alt=""
                                                            />
                                                        )}
                                                    </div>
                                                    <p><b>{job.project_name}</b></p>
                                                    <p>{job.username} - {job.creation_date}</p>
                                                </div>
                                            );
                                        })
                                }


                                {jobs[tagId].count > (currentPage + 1) * jobsPerPage && !loading && !loadingJobs && (
                                    <FontAwesomeIcon className='arrow arrow-right' onClick={() => handleNextPage()} icon={faCaretRight} tabIndex="0" 
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleNextPage();
                                        }
                                    }}
                                    />
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
