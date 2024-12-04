
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './job_page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload, faSpinner, faTag } from '@fortawesome/free-solid-svg-icons';
import JobPreview from '../job_preview/job_preview';
import { Popup } from '../popup_message/popup_message';
import JSZip from 'jszip';
import { useTranslation } from 'react-i18next';

/**
 * It shows a job page with all the information about the job
 * @returns The job page
 */
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
        comments: [],
    });
    const [tags, setTags] = useState([]); 
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState(''); 
    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [jobFiles, setJobFiles] = useState([]); 
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [loading, setLoading] = useState(false);
    const maxCharacters = 255;
    const [errorMsg, setErrorMsg] = useState('');
    const [showErrorPopup, setErrorShowPopup] = useState(false);

    const handleShowDetails = (e) => {
        e.target.innerHTML = e.target.innerHTML === t("show-details") ? t("hide-details") : t("show-details")
        let preview = document.getElementById("preview")
        let details = document.querySelector(".file_details")
        preview.classList.toggle("showing-details")
        details.classList.toggle("showing-details")
    }

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
        if (selectedFile) {
            setSelectedColor(selectedFile.color);
        }
    }, [selectedFile]);

    useEffect(() => {
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                arg: 'getTagsByJobId', 
                jobId: jobId
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === 'success') {
                    console.log(data.tags);
                    setTags(data.tags); 
                } else {
                    console.error('Error in response:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching tags:', error);
            });
    }, [jobId]); 
    
    
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
                        color: data.job.color,
                        img_format: data.job.img_format,
                        customer_name: data.job.customer
                    },
                    otherJobs: shuffledOtherJobs,
                    comments: data.job.comments || []
                });
                console.log(jobData)
                setLikes(data.job.likes); 
            } else {
                setErrorShowPopup(true);
                setErrorMsg("Error. " + error);
                setTimeout(() => setErrorShowPopup(false), 3000);
            }
        })
        .catch((error) => {
            console.error('Error fetching job data:', error);
        });
        
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

        checkUserLike(); 
    }, [jobId]);

    const getLicenseText = () => {
        return jobData.info.license === 0 ? t('public') : t('private');
    };

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') {
            setErrorShowPopup(true);
            setErrorMsg(t("comment_invalid"));
            setTimeout(() => setErrorShowPopup(false), 3000);
            return;
        }
    
        
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
                setErrorShowPopup(true);
                setErrorMsg("Error. " + data.message);
                setTimeout(() => setErrorShowPopup(false), 3000);
            }
        })
        .catch((error) => {
            setErrorShowPopup(true);
            setErrorMsg("Error. " + error);
            setTimeout(() => setErrorShowPopup(false), 3000);
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
                setErrorShowPopup(true);
                setErrorMsg("Error. " + data.message);
                setTimeout(() => setErrorShowPopup(false), 3000);
            }
        })
        .catch((error) => {
            setErrorShowPopup(true);
            setErrorMsg("Error. " + error);
            setTimeout(() => setErrorShowPopup(false), 3000);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return ""; 
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('da-DK', options);
    };

    const handleDownloadZip = async () => {
        setLoading(true);
        
        try {
            const response = await fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    arg: 'getJobFilesZip',
                    jobId: jobId,
                }),
            });
            
            const data = await response.json();
            if (data.status !== 'success') {
                setErrorShowPopup(true);
                setErrorMsg('Error fetching files');
                setTimeout(() => setErrorShowPopup(false), 3000);
                setLoading(false);
                return;
            }

            const zip = new JSZip();
            const filePromises = data.files.map(async (file) => {
                try {
                    // Log the URL being fetched
                    const fileResponse = await fetch(file.file_url);
                    if (!fileResponse.ok) {
                        throw new Error(`Failed to fetch file: ${file.file_url}`);
                    }

                    // Convert the response to a Blob and verify its type
                    const blob = await fileResponse.blob();
                    // Add file to the ZIP with a specific name
                    zip.file(file.file_name, blob);
                } catch (error) {
                    console.error(`Error fetching file ${file.file_url}:`, error);
                }
            });

            // Wait for all files to be processed
            await Promise.all(filePromises);

            // Generate the ZIP file and initiate the download
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(zipBlob);
            downloadLink.download = `job_${jobId}_files.zip`;
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
            
        } catch (error) {
            setErrorShowPopup(true);
            setErrorMsg("Error. " + error);
            setTimeout(() => setErrorShowPopup(false), 3000);
        } finally {
        setTimeout(() => setLoading(false), 500);
        }
    };

    return (
        <div id="job_page">
            <div className="job_header">
                <h1>{jobData.title}</h1>
                <p>{jobData.owner}</p>
            </div>
            <div className="job_content">
                
                {showPopup && (
                    <div className="popup_background" onClick={() => setShowPopup(false)}>
                        <div className="popup_content" onClick={(e) => e.stopPropagation()}>
                            <button className="close_popup" onClick={() => setShowPopup(false)}>✕</button>
                            <div className="popup_main">
                                <JobPreview
                                    modelPath={`/3D_printer/Files/3d_files/${selectedFile.file_path}`} 
                                    fileColor={selectedColor} 
                                />
                                <div className="file_details">
                                    <h3>{t("file_details")}</h3>
                                    <p><strong>{t("color")}:</strong> {selectedFile.color}</p>
                                    <p><strong>{t("scale")}:</strong> {selectedFile.scale}</p>
                                    <p><strong>{t("physical_weight")}:</strong> {selectedFile.physical_weight} g</p>
                                    <p><strong>{t("file")} {t("weight")}:</strong> {selectedFile.file_weight} MB</p>
                                    <p><strong>{t("material")}:</strong> {selectedFile.material}</p>
                                    <ul className="color-buttons">
                                        <div className="color-default">
                                            <button className="color-button default" onClick={() => setSelectedColor(selectedFile.color)}>
                                                {t("default_file_color")}
                                            </button>
                                        </div>
                                        <li className="color-button yellow" onClick={() => setSelectedColor("Yellow")}></li>
                                        <li className="color-button red" onClick={() => setSelectedColor("Red")}></li>
                                        <li className="color-button blue" onClick={() => setSelectedColor("Blue")}></li>
                                        <li className="color-button green" onClick={() => setSelectedColor("Green")}></li>
                                        <li className="color-button black" onClick={() => setSelectedColor("Black")}></li>
                                        <li className="color-button white" onClick={() => setSelectedColor("White")}></li>
                                        <li className="color-button grey" onClick={() => setSelectedColor("Grey")}></li>
                                    </ul>
                                </div>
                                <div onClick={handleShowDetails} className='show-details'>
                                   <p>{t("show-details")}</p> 
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className='job_images'>
                    <div className='image_scroll'>
                        <div className="job_files_container">
                            {jobFiles.map((file, index) => (
                                <div className="file_container" key={index}>
                                    <h3 className="file_title"><strong>{t("job_file")}</strong> <p></p>{file.name}</h3>
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
                <div className='disp_info'>
                    <div className="job_display">
                        <img src={`/3D_printer/Files/img/jobs/${jobId}${jobData.info.img_format}`} onError={(e) => e.target.src = '/3D_printer/Files/img/default-job.png'} />
                        <div className="job_actions">
                            <button className={`like_button ${liked ? 'liked' : 'unliked'}`} onClick={handleLikeClick}>
                                <FontAwesomeIcon icon={faHeart} />
                            </button>
                            <button 
                                className={`download_zip_button ${loading ? 'loading' : ''}`} 
                                onClick={handleDownloadZip} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                ) : (
                                    <FontAwesomeIcon icon={faDownload} />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="job_info">
                        <h3>{t("job_info")}</h3>
                        <div>
                        <div className="job_info_item">
                            <span className="job_info_label">{t("license")}:</span>
                            <span className="job_info_value">{jobData.info.license}</span>
                        </div>
                        <div className="job_info_item">
                            <span className="job_info_label">{t("likes")}:</span>
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
                            {jobData.info.color === "" ? <span className="job_info_value">Undefined</span> : <span className="job_info_value">{jobData.info.color}</span>}
                            
                        </div>
                        <div className="job_info_item">
                            <span className="job_info_label">{t("customer")}:</span>
                            {jobData.info.color === "" ? <span className="job_info_value">Undefined</span> : <span className="job_info_value">{jobData.info.customer_name}</span>}
                        </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>

            <div className="job_details">
                <div className="job_box">
                       <div className="job_description">
                            <h3>{t("description")}</h3>
                            <p>{jobData.description}</p>
                            {tags.length > 0 && (
                                <div className="job_tags">
                                    {tags.map((tag) => (
                                        <div key={tag.id} className="filter_style">
                                            {tag.name_tag} 
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    {isLoggedIn ? (
                        <div className="comment_form" style={{ position: "relative" }}>
                            <textarea
                                placeholder={t("write_comment")}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                maxLength={maxCharacters}
                                style={{ paddingBottom: "20px" }} 
                            />
                            <span className={`character_count ${newComment.length >= maxCharacters ? 'limit-reached' : ''}`}
                            >
                                {newComment.length}/{maxCharacters}
                            </span>
                            <button onClick={handleCommentSubmit}>{t("send_comment")}</button>
                        </div>
                    ) : (
                        <div className="comment_form disabled">
                            <textarea disabled placeholder={t("write_comment")}></textarea>
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
                    <h3>{t("other_jobs")} {jobData.owner}</h3><br/>
                    <div className='other-jobs-list'>
                    {jobData?.otherJobs?.length > 0 ? (
                        jobData.otherJobs.map((otherJob, index) => (
                            <div key={index} className="other_job" onClick={() => handleJobClick(otherJob.id)}>
                                <img
                                    src={`/3D_printer/Files/img/jobs/${otherJob.id}${otherJob.img_format}`}
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

            {showErrorPopup && (
                <Popup message={errorMsg} status="warning"/>
            )}

        </div>
    );
};

export default JobPage;