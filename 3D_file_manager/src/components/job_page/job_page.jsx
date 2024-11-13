import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './job_page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload } from '@fortawesome/free-solid-svg-icons';
import JobPreview from '../job_preview/job_preview';
import { OrthographicCamera } from 'three';
import { useTranslation } from 'react-i18next';

export const JobPage = () => {
    const location = useLocation();
    const navigateTo = useNavigate();
    const { jobId } = location.state || {};
    const { t } = useTranslation();
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
                const shuffledOtherJobs = data.otherJobs.sort(() => Math.random() - 0.5);
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
                    otherJobs: shuffledOtherJobs,
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
                setJobFiles(data.files); 
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
    
        // Inicializar 'date' con la fecha actual en formato ISO
        const date = new Date().toISOString();
    
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'saveComment',
                jobId: jobId,
                text: newComment,
                date: date
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setJobData((prevState) => ({
                    ...prevState,
                    comments: [...prevState.comments, { username, text: newComment, date }]
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
        console.log(selectedFile.color)
        setShowPopup(true); 
    };

    const handleDownloadClick = (file) => {
        const fileUrl = `/3D_printer/Files/3d_files/${file.file_path}`;
        window.open(fileUrl, '_blank'); 
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return ""; 
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('da-DK', options);
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
                            {jobFiles.map((file, index) => (
                                <div className="file_container" key={index}>
                                    <h3 className="file_title">{t("job_file")} {file.id}</h3>
                                    <div className="file_actions">
                                        <button className="preview_button" onClick={() => handlePreviewClick(file)}>
                                            {t("preview")}
                                        </button>
                                        <button className="download_button" onClick={() => handleDownloadClick(file)}>
                                            {t("download")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {showPopup && (
                    <div className="popup">
                        <div className="popup_content">
                            <button className="close_popup" onClick={() => setShowPopup(false)}>✕</button>
                            <div className="popup_main">
                                    <JobPreview modelPath={`/3D_printer/Files/3d_files/${selectedFile.file_path}`} fileColor={selectedFile.color} />
                                <div className="file_details">
                                    <h3>{t("file_details")}</h3>
                                    <p><strong>{t("color")}:</strong> {selectedFile.color}</p>
                                    <p><strong>{t("scale")}:</strong> {selectedFile.scale}</p>
                                    <p><strong>{t("physical_weight")}:</strong> {selectedFile.physical_weight} g</p>
                                    <p><strong>{t("file")} {t("weight")}:</strong> {selectedFile.file_weight} MB</p>
                                    <p><strong>{t("material")}:</strong> {selectedFile.material}</p>
                                </div>
                            </div>
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
                    <h3>{t("job_info")}</h3>
                    <div className="job_info_item">
                        <span className="job_info_label">{t("license")}:</span>
                        <span className="job_info_value">{jobData.info.license}</span>
                    </div>
                    <div className="job_info_item">
                        <span className="job_info_label">Likes:</span>
                        <span className="job_info_value">{likes}</span>
                    </div>
                    <div className="job_info_item">
                        <span className="job_info_label">{t("layer_thickness")}:</span>
                        <span className="job_info_value">{jobData.info.layer_thickness}</span>
                    </div>
                    <div className="job_info_item">
                        <span className="job_info_label">{t("creation_date")}:</span>
                        <span className="job_info_value">{jobData.info.creation_date}</span>
                    </div>
                    <div className="job_info_item">
                        <span className="job_info_label">{t("color")}:</span>
                        <span className="job_info_value">{jobData.info.color}</span>
                    </div>
                </div>
            </div>

            <div className="job_details">
                <div className="job_box">
                    <div className="job_description">
                        <h3>{("job_desc")}</h3>
                        <p>{jobData.description}</p>
                    </div>
                    {isLoggedIn ? (
                        <div className="comment_form">
                            <textarea
                                placeholder="Write a new comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button onClick={handleCommentSubmit}>{t("send_comment")}</button>
                        </div>
                    ) : (
                        <div className="comment_form disabled">
                            <textarea disabled placeholder="Write a new comment"></textarea>
                            <button disabled>{t("send_comment")}</button>
                        </div>
                    )}

                    <div className="job_comments">
                        {jobData.comments.length > 0 ? (
                            jobData.comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <div className="comment_header">
                                        <h3>{comment.username}</h3>
                                        <span className="comment_date">{formatDate(comment.date)}</span>
                                    </div>
                                    <p className="comment_text">{comment.text}</p>
                                </div>
                            ))
                        ) : (
                            <p>{t("no_comments")}</p>
                        )}
                    </div>
                </div>
                <div className="other_jobs">
                    <h3>{t("other_jobs")}</h3>
                    {jobData?.otherJobs?.length > 0 ? (
                        jobData.otherJobs.map((otherJob, index) => (
                            <div key={index} className="other_job" onClick={() => handleJobClick(otherJob.id)}>
                                <img
                                    src={`/3D_printer/Files/img/jobs/${otherJob.id}.jpeg`}
                                    alt={`${otherJob.title} preview`}
                                    onError={(e) => e.target.src = '/3D_printer/Files/img/default-job.png'}
                                    className="other_job_image"
                                />
                                <div className="other_job_details">
                                    <h4 className="other_job_title">{otherJob.title}</h4>
                                    <div className="like_container">
                                        <FontAwesomeIcon icon={faHeart}/>
                                        <div className="other_job_likes">{otherJob.likes}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>{t("no_jobs")}</div>
                    )}
                </div>
            </div>

            

        </div>
    );
};

export default JobPage;
