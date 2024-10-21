import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './job_page.css';

export const JobPage = ({ }) => {
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

    useEffect(() => {
        console.log('Job ID:', jobId); // Verificas que jobId llega correctamente
        window.scrollTo(0, 0);
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
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Job Data:', data);
                console.log("ES ESTE");
                console.log(jobId);
                if (data.status === "success") {
                    console.log('Data recibida del servidor:', data);
                    setJobData({
                        title: data.job.title,
                        owner: data.job.owner,
                        images: data.job.images,
                        description: data.job.description,
                        info: data.job.info,
                        otherJobs: data.otherJobs,
                        comments: data.comments
                    })
                    console.log('Estado actualizado con setJobData:', {
                        title: data.job.title,
                        owner: data.job.owner,
                        images: data.job.images,
                        description: data.job.description,
                        info: data.job.info,
                        otherJobs: data.otherJobs,
                        comments: data.comments
                    });
                    ;
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching job data:', error);
            });
    }, [jobId]);
    

    return  (
        <div className="job_page">
            {/* Título y dueño del proyecto */}
            <div className="job_header">
                <h1>{jobData.title}</h1>
                <p>{jobData.owner}</p>
            </div>

            <div className="job_content">
                {/* Contenedor de imágenes con scrollbar */}
                <div className="job_images">
                    <div className="image_scroll">
                        {jobData.images.map((image, index) => (
                            <img key={index} src={image} alt={`Job IMG ${index}`} />
                        ))}

                    </div>
                </div>

                {/* Thumbnail del proyecto con botones de like y descarga */}
                <div className="job_display">
                        <h2>Job</h2>
                        <div className="job_actions">
                            <button className="like_button">❤️</button>
                            <button className="download_button">⬇️</button>
                        </div>
                </div>

                {/* Información del proyecto */}
                <div className="job_info">
                    <h3>Job Info</h3>
                    <p>{jobData.info}</p>
                </div>
            </div>

            {/* Descripción del proyecto */}
            <div className="job_description">
                <h3>Job Desc</h3>
                <p>{jobData.description}</p>
            </div>

            {/* Sección de comentarios */}
            <div className="job_comments">
                <h3>Comments</h3>
                {Array.isArray(jobData.comments) && jobData.comments.length > 0 ? (
                    jobData.comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p><strong>{comment.username}:</strong> {comment.text}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay comentarios.</p> // Si no hay comentarios, mostramos este mensaje o simplemente no renderizamos nada
                )}
            </div>

            {/* Otros proyectos */}
            <div className="other_jobs">
                <h3>Other Jobs</h3>
                {jobData.otherJobs.map((otherJob, index) => (
                    <div key={index} className="other_job">{otherJob.title}</div>
                ))}
            </div>
        </div>
    );
};

export default JobPage;
