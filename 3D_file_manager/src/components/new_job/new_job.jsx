import React, { useCallback, useState, useEffect, useRef, useContext} from "react";
import { UserContext } from "../../context/UserContext";
import "./new_job.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload,faTrash} from '@fortawesome/free-solid-svg-icons';

/**
 * The new job component. It is a popup that appears when the user clicks on the new job button.
 * @param {closeNewJob} a function to close the new job popup 
 * @returns A popup to create a new job
 */
export const NewJob = ({closeNewJob, tags: propTags})=>{
    const [files,setFiles] = useState([])
    const [zipFile,setZipFile] = useState(null)
    const [imgFile,setImg] = useState(null)
    const [tags,setTags] = useState([])
    const imgUploadContainerRef = useRef(null)
    const zipTrashRef = useRef(null)
    const selectTagRef = useRef(null)
    const fileInputRef = useRef(null)
    const uploadStl = useRef(null)
    const uploadZip = useRef(null)
    const zipFileRef = useRef(null)
    const [selectedUploadMode, setSelectedUploadMode] = useState("stl");
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);
    const [selectedValue, setSelectedValue] = useState('');

    const handleSuggestTag = () => {

    }

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const handleSelectChange = (e) => {
        console.log(e.target.value)
        setSelectedValue(e.target.value)
    }
    // useEffect(()=>{
    //     console.log(selectTagRef.value)
    //     setSelectedValue(selectTagRef.value)
    // },[selectTagRef.value])

    /**
     * This function deletes a file from the files array.
     * @param {indexToDelete} The index of the file to delete 
     */
    const handleDeleteFile = (indexToDelete) => {
        setFiles((prevFiles) => 
            prevFiles.filter((file, index) => index !== indexToDelete)
        );
    };

    /**
     * This function handles the change of the image input. It shows the image in the background of the container.
     * @param {e} The event of the input change 
     */
    const handleImgChange = (e) => {
        const img = e.target.files[0]
        if(img){
            const reader = new FileReader();
            reader.onloadend = () => {
                imgUploadContainerRef.current.style.backgroundImage = `url(${reader.result})`;
                setImg(img)
            };
            reader.readAsDataURL(img); 
        }
    }

    /**
     * This function handles the change of the file input. It shows the file in the files array.
     * @param {e} The event of the input change 
     */
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
    /**
     * This function handles the change of the zip input. It shows the zip file in the zipFile state.
     * @param {e} The event of the input change 
     */
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

    /**
     * This function deletes the zip file from the zipFile state.
     */
    const handleDeleteZip = () => {
        zipFileRef.current.innerHTML = "No file yet..."
        setZipFile(null)
        zipTrashRef.current.classList.add("hide-trash")
    }

    const handleClearImg = () => {
        fileInputRef.current.value = ""
        imgUploadContainerRef.current.style.backgroundImage = "none"
    }

    /**
     * This function sets the selected upload mode.
     * @param {e} The event of the click 
     */
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

    const addNewTag = () => {
        setTags((prevTags) => [...prevTags,selectedValue])
    }

    const handleUpload = async (e) => {
        if(!isLogged){
            return;
        }
        e.preventDefault();
    
        // if (imgFile && !["jpg", "jpeg", "png"].includes(imgFile.name.split('.').pop().toLowerCase())) {
        //     alert("Only .jpg, .jpeg and .png files allowed");
        //     return;
        // }
    
        // const invalidFiles = files.filter(file => !["stl", "3mf"].includes(file.name.split('.').pop().toLowerCase()));
        // if (invalidFiles.length > 0) {
        //     alert("Only .stl and .3mf files allowed");
        //     return;
        // }
    
        // const formData = new FormData();
        // formData.append('arg', 'setNewJob');
        // formData.append('username',username);
        // formData.append('name', document.getElementById("form-name").value);
        // formData.append('description', document.getElementById("form-desc").value);
        // formData.append('scale', document.getElementById("form-scale").value);
        // formData.append('color', document.getElementById("form-color").value);
        // formData.append('material', document.getElementById("form-material").value);
    
        // formData.append('img_file', imgFile);
        // formData.append('files',files);

        // formData.forEach((value, key) => {
        //     console.log(key + ": " + value);
        // });

        const name = document.getElementById("form-name").value
        console.log(name)
    
        try {
            const response = await fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                body: {
                    arg: "setNewJob",
                    name: name
                }
            });
            const data = await response.json();
            if (data.success) {
                alert("Proyecto subido correctamente.");
            } else {
                alert("Error al subir el proyecto.");
            }
        } catch (error) {
            console.error("Error en la carga del proyecto:", error);
            alert("Hubo un problema al cargar el proyecto.");
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <>
            <div onClick={closeNewJob} className="blur_content">
                <div onClick={handleContainerClick} className="container">
                    <div className="new-job-header">
                        <h2>new job</h2>
                    </div>
                        <form className="main" onSubmit={handleFormSubmit}>
                            <div className="form-container">
                                <div className="img-upload-manager">
                                    <div ref={imgUploadContainerRef} className="img-upload-container">
                                        <label className="img-upload-label" htmlFor="img-upload">
                                            <FontAwesomeIcon className="upload-icon" icon={faUpload}/>
                                            <input ref={fileInputRef} id="img-upload" className="img-upload" type="file" onChange={handleImgChange} accept="image/jpg, image/png, image/jpeg"/>
                                        </label>
                                    </div>
                                    <p>* Only .jpg, .png and .jpeg accepted</p>
                                    <button className="nj-delete-image" onClick={handleClearImg}>Delete image</button>
                                </div>
                                    
                                <div className="nj-form">
                                    <label className="needed nj-label">
                                        <input id="form-name" className="project-name" type="text" placeholder="Project Name..."/>
                                    </label>
                                    <label className="needed nj-label">
                                        <b>Project Description</b>
                                        <textarea id="form-desc" placeholder="Description..."/>
                                    </label>
                                    <div className="responsive_label">
                                    <label className="nj-label scale_lbl">
                                        <b>Scale</b>
                                        <input id="form-scale" className=""/>
                                    </label>
                                    <label className="nj-label color_lbl">
                                        <b>Color</b>
                                        <div className="input-row">
                                        <input id="form-color" type="" className=""/>
                                        </div>
                                    </label>
                                    </div>
                                <label className="nj-label">
                                    <b>Material</b>
                                    <input id="form-material" type="text" className="" />
                                </label>
                            </div>

                            <div className="nj-side-cont">
                                <div className="nj-tags">
                                    <p>Select Tags</p>
                                    <div>
                                        <select ref={selectTagRef} className="nj-select-tags" value={selectedValue} onChange={handleSelectChange}>
                                            <option value="" disabled selected>-- SELECT --</option>
                                            {propTags.map((tag, index) => (
                                                <option key={index} value={tag.name_tag}>{tag.name_tag}</option>
                                            ))}
                                        </select>
                                        <button className="nj-select-tags-button" onClick={() => addNewTag(selectedValue)}>Add tag</button>
                                    </div>
                                    <div className="suggest-tag-cont">
                                        <p className="small-font">No tag matches your project? </p>
                                        <p onClick={handleSuggestTag} className="small-font suggest-tag">Suggest new tag</p>
                                    </div>
                                    <div className="nj-tags-added">
                                        {tags.map((tag, index) => {
                                            console.log(tag)
                                            return <p key={index} className="nj-tag">{tag}</p>
                                        }

                                        )}
                                    </div>
                                </div>
                                <div className="nj-customers">
                                    <p>Select Customer</p>
                                    <div>
                                        <select ref={selectTagRef} className="nj-select-customer" value={selectedValue} onChange={handleSelectChange}>
                                            <option value="" disabled selected>-- SELECT --</option>
                                            {propTags.map((tag, index) => (
                                                <option key={index} value={tag.name_tag}>{tag.name_tag}</option>
                                            ))}
                                        </select>
                                        <button className="nj-select-customer-button" onClick={() => addNewTag(selectedValue)}> Save</button>
                                    </div>
                                    <div className="suggest-customer-cont">
                                        <p className="small-font">No customer matches your project? </p>
                                        <p onClick={handleSuggestTag} className="small-font suggest-tag">Suggest new customer</p>
                                    </div>
                                    <div className="nj-customer-added">
                                        {tags.map((tag, index) => {
                                            console.log(tag)
                                            return <p key={index} className="nj-customer">{tag}</p>
                                        }

                                        )}
                                    </div>
                                </div>
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
                                <div className="lower-right">
                                    
                                    <div className="upload-options">
                                        <button className="cancel-button" onClick={closeNewJob}>CANCEL</button>
                                        <button className="upload-button" onClick={handleUpload}>UPLOAD</button>
                                    </div>
                                </div>
                            </div>
                    </form>
                </div>
            </div>
        </>
    )
}