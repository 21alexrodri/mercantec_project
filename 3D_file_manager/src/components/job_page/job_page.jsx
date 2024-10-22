import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import './job_page.css';

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
    const [isLoggedIn, setIsLoggedIn] = useState(true); //CHANGE TO FALSE
    const navigateTo = useNavigate();
    const imageLink = "/3D_printer/Files/img/default-job.png";

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
                    setIsLoggedIn(true); // CHANGE TO FALSE 
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
            console.log(data)
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
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch((error) => {
            console.error('Error fetching job data:', error);
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
                arg: 'saveComment', // Asegúrate de usar el argumento correcto
                jobId: jobId,
                text: newComment // No enviamos el username porque se obtiene del servidor
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
        console.log("ENTRA: "+id)
        navigateTo('/job_page', { state: { jobId: id } });
    };

    return (
        <div id="job_page">
            <div className="job_header">

                <h1>{jobData.title}</h1>
                <p>{jobData.owner}</p>
            </div>
            <div className="job_content">
                {/* Contenedor de imágenes con scrollbar */}
                <div className="job_images">
                    <div className="image_scroll">
                        <div className="image_container"><img src={imageLink}></img></div>
                        <div className="image_container"><img src={imageLink}></img></div>
                        <div className="image_container"><img src={imageLink}></img></div>
                        <div className="image_container"><img src={imageLink}></img></div>
                        <div className="image_container"><img src={imageLink}></img></div>
                        {jobData.images.map((image, index) => (
                            <div className="image_container" key={index}>
                                <img key={index} src={image} alt={`Job IMG ${index}`} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Thumbnail del proyecto con botones de like y descarga */}
                <div className="job_display">
                    <img src={`/3D_printer/Files/img/jobs/${jobId}.jpg`} onError={(e) => e.target.src = '/3D_printer/Files/img/default-job.png'} />
                        <div className="job_actions">
                            <button className="like_button">❤️</button>
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
