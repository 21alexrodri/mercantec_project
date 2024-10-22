import { useCallback, useState, useEffect, useRef} from "react";
import "./new_job.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload,faTrash} from '@fortawesome/free-solid-svg-icons';

export const NewJob = ({closeNewJob})=>{
    const [files,setFiles] = useState([])
    const [zipFile,setZipFile] = useState(null)
    const imgUploadContainerRef = useRef(null)
    const zipTrashRef = useRef(null)
    const fileInputRef = useRef(null)
    const uploadStl = useRef(null)
    const uploadZip = useRef(null)
    const zipFileRef = useRef(null)
    const [selectedUploadMode, setSelectedUploadMode] = useState("stl");

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const handleDeleteFile = (indexToDelete) => {
        setFiles((prevFiles) => 
            prevFiles.filter((file, index) => index !== indexToDelete)
        );
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
                e.target.value = ""
            }
            reader.readAsDataURL(file);
        }
    }
    
    const handleZipUpload = (e) => {
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                let newFile = `url(${reader.result})`
                setZipFile(newFile)
                zipFileRef.current.innerHTML = file.name + "<FontAwesomeIcon icon={faTrash} cursor=\"pointer\" onClick={handleDeleteZip} />"
                e.target.value = ""
            }
            reader.readAsDataURL(file);
            zipTrashRef.current.classList.remove("hide-trash")
        }
    }

    const handleDeleteZip = () => {
        zipFileRef.current.innerHTML = "No file yet..."
        setZipFile(null)
        zipTrashRef.current.classList.add("hide-trash")
    }

    const handleClearImg = () => {
        fileInputRef.current.value = ""
        imgUploadContainerRef.current.style.backgroundImage = "none"
    }

    const setSelected = (e) => {
        if(e.target == uploadStl.current){
            uploadZip.current.classList.remove("selected-mode")
            setSelectedUploadMode("stl")
        }else{
            uploadStl.current.classList.remove("selected-mode")
            setSelectedUploadMode("zip")
        }
        e.target.classList.add("selected-mode")
    }

    const handleUpload = (e) => {
        
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
                        <div className="lower">
                            <div className="files-upload">
                                <div className="upload-type-selector">
                                    <p ref={uploadStl} className="upload-stl selected-mode" onClick={setSelected}>Upload files</p>
                                    <p ref={uploadZip} className="upload-zip" onClick={setSelected}>Upload ZIP</p>
                                </div>
                                <ul className="files-list">
                                    {(
                                        selectedUploadMode === "stl"
                                    ) ? (
                                        <>
                                            {(
                                                files.length==0
                                            )?(
                                                <>
                                                    <li className="nj-file-cont">
                                                        <p>No files yet...</p>
                                                    </li>
                                                </>
                                            ):(
                                                <>
                                                    {files.map((file, index) => (
                                                        <li key={index} className="nj-file-cont">
                                                            <p>{file.name}</p><FontAwesomeIcon icon={faTrash} cursor="pointer" onClick={()=>handleDeleteFile(index)} />
                                                        </li>
                                                    ))}
                                                </>
                                            )}
                                            
                                            <li className="new-file nj-file">
                                                <p>+</p>
                                                <input type="file" accept=".stl" onChange={handleFileChange}/>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <div className="zip-upload-cont">
                                                <div className="zip-upload">
                                                    <p>Upload</p>
                                                    <input type="file" accept=".zip" onChange={handleZipUpload}/>
                                                </div>
                                                <p ref={zipFileRef}>
                                                    No file yet...
                                                </p>
                                                <FontAwesomeIcon ref={zipTrashRef} className="hide-trash" icon={faTrash} cursor="pointer" onClick={handleDeleteZip} />
                                            </div>
                                            
                                            
                                        </>
                                    )}
                                    
                                </ul>
                            </div>
                            <div className="upload-options">
                                <button className="cancel-button" onClick={closeNewJob}>CANCEL</button>
                                <button className="upload-button" onClick={handleUpload}>UPLOAD</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}