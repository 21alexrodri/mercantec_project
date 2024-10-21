import { useCallback, useState, useEffect, useRef} from "react";
import "./new_job.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';

export const NewJob = ({closeNewJob})=>{
    const [files,setFiles] = useState([])
    const imgUploadContainerRef = useRef(null)
    const fileInputRef = useRef(null)

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    // ESTO ESTÁ MAL, NO ELIMINA EL FILE DEL ARRAY !!!!!!!!

    const handleDeleteFile = (e) => {
        e.target.style.display = "none"
        for(let file in files){

        }
    };

    const handleImgChange = (e) => {
        const img = e.target.files[0]
        if(img){
            const reader = new FileReader();
            reader.onloadend = () => {
                imgUploadContainerRef.current.style.backgroundImage = `url(${reader.result})`;
            };
            reader.readAsDataURL(img); 
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                let newFile = `url(${reader.result})`
                setFiles((prevFiles) => [...prevFiles,{"url" : newFile, "name" : file.name}])
            }
            reader.readAsDataURL(file);
        }
    }

    const handleClearImg = () => {
        fileInputRef.current.value = ""
        imgUploadContainerRef.current.style.backgroundImage = "none"
    }

    return(
        <>
            <div onClick={closeNewJob} className="blur_content">
                <div onClick={handleContainerClick} className="container">
                    <div className="new-job-header">
                        <h2>new job</h2>
                    </div>
                    <div className="main">
                        <div className="form-container">
                            <div className="img-upload-manager">
                                <div ref={imgUploadContainerRef} className="img-upload-container">
                                    <label className="img-upload-label" htmlFor="img-upload">
                                        <FontAwesomeIcon className="upload-icon" icon={faUpload}/>
                                        <input ref={fileInputRef} id="img-upload" className="img-upload" type="file" onChange={handleImgChange} accept="image/jpg, image/png, image/jpeg"/>
                                    </label>
                                </div>
                                <p>* Only .jpg, .png and .jpeg accepted</p>
                                <button class="nj-delete-image" onClick={handleClearImg}>Delete image</button>
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
                            <ul class="files-list">
                                {files.map((file, index) => (
                                    <li onClick={handleDeleteFile} className="nj-file">
                                        {file.name}
                                    </li>
                                ))}
                                <li className="nj-file new-file">
                                    <input type="file" onChange={handleFileChange}/>
                                </li>
                            </ul>
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