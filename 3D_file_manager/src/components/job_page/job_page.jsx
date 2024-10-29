import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './job_page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload } from '@fortawesome/free-solid-svg-icons';
import JobPreview from '../job_preview/job_preview';

export const JobPage = () => {
    const location = useLocation();
    const { jobId } = location.state || {};
    const [jobData, setJobData] = useState({
        title: '',
        owner: '',
        images: [],
        description: '',
        info: '',
        otherJobs: [],
        comments: []
    });
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState(''); 
    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [jobFiles, setJobFiles] = useState([]); 
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const checkUserLike = () => {
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'checkUserLike',
                jobId: jobId
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setLiked(data.liked); 
            } else {
                console.error('Error checking like status:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error checking like status:', error);
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ arg: 'getUserSession' }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setUsername(data.user.username); 
                setIsLoggedIn(true); 
            } else {
                setIsLoggedIn(false); 
            }
        })
        .catch((error) => {
            console.error('Error verificando el login:', error);
        });

        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'getJobById',
                jobId: jobId
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                setJobData({
                    title: data.job.title,
                    owner: data.job.owner,
                    images: data.job.images,
                    description: data.job.description,
                    info: {
                        license: data.job.license,
                        likes: data.job.likes,
                        layer_thickness: data.job.layer_thickness,
                        creation_date: data.job.creation_date,
                        color: data.job.color
                    },
                    otherJobs: data.otherJobs,
                    comments: data.job.comments || []
                });
                setLikes(data.job.likes); 
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch((error) => {
            console.error('Error fetching job data:', error);
        });

        // Obtener los archivos del jobId
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'getJobFiles',
                jobId: jobId
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setJobFiles(data.files); // Guardar los archivos en el estado
            } else {
                console.error('Error fetching files:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error fetching job files:', error);
        });

        checkUserLike(); // Verificar si el usuario ya ha dado "like"
    }, [jobId]);

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') {
            alert('Please enter a comment.');
            return;
        }

        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'saveComment',
                jobId: jobId,
                text: newComment
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setJobData((prevState) => ({
                    ...prevState,
                    comments: [...prevState.comments, { username, text: newComment }]
                }));
                setNewComment('');
            } else {
                alert('Error saving comment: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error saving comment:', error);
        });
    };

    const handleJobClick = (id) => {
        navigateTo('/job_page', { state: { jobId: id } });
    };

    const handleLikeClick = () => {
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'toggleLike',
                jobId: jobId
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.status === 'success') {
                setLikes(prevLikes => liked ? prevLikes - 1 : prevLikes + 1);
                setLiked(prevLiked => !prevLiked);
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error handling like:', error);
        });
    };

    const handlePreviewClick = (file) => {
        setSelectedFile(file);
        setShowPopup(true); 
    };

    const handleDownloadClick = (file) => {
        const fileUrl = `/3D_printer/Files/3d_files/${file.file_path}`;
        window.open(fileUrl, '_blank'); 
    };

    return (
        <div id="job_page">
            <div className="job_header">
                <h1>{jobData.title}</h1>
                <p>{jobData.owner}</p>
            </div>
            <div className="job_content">
                <div className='job_images'>
                    <div className='image_scroll'>
                        <div className="job_files_container">
                            <div className="files_scroll">
                                {/* Mostrar los archivos obtenidos del job */}
                                {jobFiles.map((file, index) => (
                                    <div className="file_container" key={index}>
                                        <h3>Job File {file.id}</h3> 
                                        <div className="file_actions">
                                            <button className="preview_button" onClick={() => handlePreviewClick(file)}>
                                                Preview
                                            </button>
                                            <button className="download_button" onClick={() => handleDownloadClick(file)}>
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {showPopup && (
                    <div className="popup">
                        <div className="popup_content">
                        <h3>3D Preview</h3>
                        <JobPreview modelPath={`/3D_printer/Files/3d_files/${selectedFile.file_path}`} />
                        <button className="close_popup" onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    </div>
                )}  


                <div className="job_display">
                    <img src={`/3D_printer/Files/img/jobs/${jobId}.jpeg`} onError={(e) => e.target.src = '/3D_printer/Files/img/default-job.png'} />
                    <div className="job_actions">
                        <button className={`like_button ${liked ? 'liked' : 'unliked'}`} onClick={handleLikeClick}>
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <button className="download_button">
                            <FontAwesomeIcon icon={faDownload} />
                        </button>
                    </div>
                </div>

                <div className="job_info">
                    <h3>Job Info</h3>
                    <p>License: {jobData.info.license}</p>
                    <p>Likes: {likes}</p>
                    <p>Layer Thickness: {jobData.info.layer_thickness}</p>
                    <p>Creation Date: {jobData.info.creation_date}</p>
                    <p>Color: {jobData.info.color}</p>
                </div>
            </div>

            <div className="job_description">
                <h3>Job Desc</h3>
                <p>{jobData.description}</p>
            </div>

            {isLoggedIn ? (
                <div className="comment_form">
                    <textarea
                        placeholder="Write a new comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleCommentSubmit}>Send Comment</button>
                </div>
            ) : (
                <p>You must be logged in to leave a comment.</p>
            )}

            <div className="job_comments">
                {jobData.comments.length > 0 ? (
                    jobData.comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p><strong>{comment.username}:</strong> {comment.text}</p>
                        </div>
                    ))
                ) : (
                    <p>There are no comments.</p>
                )}
            </div>
            <div className="other_jobs">
                <h3>Other Jobs</h3>
                {jobData?.otherJobs?.length > 0 ? (
                    jobData.otherJobs.map((otherJob, index) => (
                        <div key={index} className="other_job" onClick={() => handleJobClick(otherJob.id)}>
                            {otherJob.title}
                        </div>
                    ))
                ) : (
                    <div>No hay trabajos disponibles</div>
                )}
            </div>
        </div>
    );
};

export default JobPage;
