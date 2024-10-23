import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './job_page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

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
    const [username, setUsername] = useState(''); // Estado para almacenar el usuario logueado
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Cambia a false si el usuario no está logueado
    const navigateTo = useNavigate();
    const imageLink = "/3D_printer/Files/img/default-job.png";
    const [likes, setLikes] = useState(jobData.info.likes); // Inicia con los likes del backend
    const [liked, setLiked] = useState(false);
    const [jobFiles, setJobFiles] = useState([]); // Almacenar archivos relacionados con el trabajo
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Verificar si el usuario está logueado
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
                    setUsername(data.user.username); // Guardar el nombre del usuario logueado
                    setIsLoggedIn(true); // El usuario está logueado
                } else {
                    setIsLoggedIn(false); // Cambia a false si no está logueado
                }
            })
            .catch((error) => {
                console.error('Error verificando el login:', error);
            });

        // Llamada al backend para obtener los datos del proyecto
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
                setLikes(data.job.likes); // Inicializar likes desde el backend
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch((error) => {
            console.error('Error fetching job data:', error);
        });

        // Llamada al backend para obtener los archivos relacionados con el trabajo
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
                setJobFiles(data.files); // Almacenar los archivos obtenidos
            } else {
                console.error('Error fetching files:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error fetching job files:', error);
        });
    }, [jobId]);

    // Función para enviar un comentario
    const handleCommentSubmit = () => {
        if (newComment.trim() === '') {
            alert('Please enter a comment.');
            return;
        }

        // Llamada al backend para guardar el comentario
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
                // Añadir el nuevo comentario al estado local
                setJobData((prevState) => ({
                    ...prevState,
                    comments: [...prevState.comments, { username, text: newComment }]
                }));
                setNewComment(''); // Limpiar el campo de comentario
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

    const handleLikeClick = async () => {
        try {
            const response = await fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    arg: 'toggleLike',
                    jobId: jobId
                }),
            });
    
            // Verifica el contenido de la respuesta antes de procesarla
            const responseText = await response.text(); // Obtiene la respuesta como texto plano
            console.log("Raw response text:", responseText);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Intenta parsear la respuesta solo si no está vacía
            const data = responseText ? JSON.parse(responseText) : {};
            console.log("Parsed JSON:", data);
    
            if (data.status === 'success') {
                setLikes(prevLikes => liked ? prevLikes - 1 : prevLikes + 1);
                setLiked(prevLiked => !prevLiked); // Alternar el estado de liked
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };
    

    const handlePreviewClick = (file) => {
        setSelectedFile(file);
        setShowPopup(true); // Mostrar popup cuando se haga clic en "Preview"
    };

    const handleDownloadClick = (file) => {
        const fileUrl = `/3D_printer/Files/slt/${file.file_path}`;
        window.open(fileUrl, '_blank'); // Abrir el archivo en una nueva pestaña para descarga
    };

    const closePopup = () => {
        setShowPopup(false); // Cerrar el popup
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
                {/* Contenedor de archivos con scrollbar */}
                <div className="job_files_container">
                    <div className="files_scroll">
                        {jobFiles.map((file, index) => (
                            <div className="file_container" key={index}>
                                <h3>Job File {file.id}</h3> {/* Muestra la ID o nombre del archivo */}
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
                {/* Popup para la preview */}
                {showPopup && (
                    <div className="popup">
                        <div className="popup_content">
                            <h3>3D Preview for {selectedFile.id}</h3>
                            {/* Aquí en el futuro irá el STL Viewer */}
                            <button className="close_popup" onClick={closePopup}>Close</button>
                        </div>
                    </div>
                )}

                {/* Thumbnail del proyecto con botones de like y descarga */}
                <div className="job_display">
                    <img src={`/3D_printer/Files/img/jobs/${jobId}.jpg`} onError={(e) => e.target.src = '/3D_printer/Files/img/default-job.png'} />
                    <div className="job_actions">
                        <button className={`like_button ${liked ? 'liked' : 'unliked'}`} onClick={handleLikeClick}>
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <button className="download_button">⬇️</button>
                    </div>
                </div>

                {/* Información del proyecto */}
                <div className="job_info">
                    <h3>Job Info</h3>
                    <p>License: {jobData.info.license}</p>
                    <p>Likes: {jobData.info.likes}</p>
                    <p>Layer Thickness: {jobData.info.layer_thickness}</p>
                    <p>Creation Date: {jobData.info.creation_date}</p>
                    <p>Color: {jobData.info.color}</p>
                </div>
            </div>

            {/* Descripción del proyecto */}
            <div className="job_description">
                <h3>Job Desc</h3>
                <p>{jobData.description}</p>
            </div>

            {/* Mostrar el formulario de comentarios si el usuario está logueado */}
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
                {/* Renderizado de los comentarios */}
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
