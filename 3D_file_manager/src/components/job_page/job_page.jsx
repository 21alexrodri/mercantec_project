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
        <div className="job-page">
            {/* Título y dueño del proyecto */}
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

                {/* Thumbnail del proyecto con botones de like y descarga */}
                <div className="job-thumbnail">
                    <div className="job-display">
                        <h2>Job</h2>
                        <div className="job-actions">
                            <button className="like-button">❤️</button>
                            <button className="download-button">⬇️</button>
                        </div>
                    </div>
                </div>

                {/* Información del proyecto */}
                <div className="job-info">
                    <h3>Job Info</h3>
                    <p>{jobData.info}</p>
                </div>
            </div>

            {/* Descripción del proyecto */}
            <div className="job-description">
                <h3>Job Desc</h3>
                <p>{jobData.description}</p>
            </div>

            {/* Sección de comentarios */}
            <div className="job-comments">
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
