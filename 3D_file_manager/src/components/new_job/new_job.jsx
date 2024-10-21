import { useCallback, useState, useEffect } from "react";
import "./new_job.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';

export const NewJob = ({closeNewJob})=>{

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const handlePhotoUpload = () => {

    };

    return(
        <>
            <div onClick={closeNewJob} className="blur_content">
                <div onClick={handleContainerClick} className="container">
                    <div className="new-job-header">
                        <h2>new job</h2>
                    </div>
                    <div className="main">
                        <div className="form-container">
                            <div className="img-upload" onClick={handlePhotoUpload}>
                                <FontAwesomeIcon className="upload-icon" icon={faUpload}/>
                            </div>
                            <div className="nj-form">
                                <label className="needed nj-label">
                                    <input className="project-name" type="text" placeholder="Project Name..."/>
                                </label>
                                <label className="needed nj-label">
                                    <b>Project Description</b>
                                    <textarea placeholder="Description..."/>
                                </label>
                                <label className="nj-label">
                                    <b>Scale</b>
                                    <input className=""/>
                                </label>
                                <label className="nj-label">
                                    <b>Color</b>
                                    <div className="input-row">
                                    <input type="" className=""/>
                                    </div>
                                </label>

                                {/* TRY TO CALCULATE IT WITH SCALE / MATERIAL */}

                                {/* <label className="">
                                    <b>Physical Weight</b>
                                    <div className="input-row">
                                        <input type="number" className="" placeholder="0"/>
                                        <p>g</p>
                                    </div>
                                </label> */}

                                <label className="nj-label">
                                    <b>Material</b>
                                    <input type="text" className=""/>
                                </label>
                            </div>
                        </div>
                        <div className="files-upload">

                        </div>
                        <div className="upload-options">
                            <button onClick={closeNewJob}>CANCEL</button>
                            <button>UPLOAD</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}