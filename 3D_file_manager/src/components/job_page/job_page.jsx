import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Verificar si el usuario está logueado
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
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
                    setIsLoggedIn(false); // El usuario no está logueado
                }
            })
            .catch((error) => {
                console.error('Error verificando el login:', error);
            });

        // Llamada al backend para obtener los datos del proyecto
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
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
                    info: data.job.info,
                    otherJobs: data.otherJobs,
                    comments: data.job.comments || [] // Asegúrate de que comments siempre sea un array
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
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
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

    return (
        <div className="job-page">
            <div className="job-header">
                <h1>{jobData.title}</h1>
                <p>{jobData.owner}</p>
            </div>
            <div className="job-content">
                {/* Contenedor de imágenes con scrollbar */}
                <div className="job-images">
                    <div className="image-scroll">
                        {jobData.images.map((image, index) => (
                            <img key={index} src={image} alt={`Job IMG ${index}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mostrar el formulario de comentarios si el usuario está logueado */}
            {isLoggedIn ? (
                <div className="comment-form">
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

            <div className="job-comments">
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

            <div className="other-jobs">
                <h3>Other Jobs</h3>
                {jobData.otherJobs.map((otherJob, index) => (
                    <div key={index} className="other-job">{otherJob.title}</div>
                ))}
            </div>
        </div>
    );
};

export default JobPage;
