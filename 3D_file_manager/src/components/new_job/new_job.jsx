import React, { useCallback, useState, useEffect, useRef, useContext} from "react";
import "./new_job.css"
import { UserContext } from "../../context/UserContext";
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
    const [customers,setCustomers] = useState([])
    const imgUploadContainerRef = useRef(null)
    const zipTrashRef = useRef(null)
    const selectTagRef = useRef(null)
    const selectCustRef = useRef(null)
    const fileInputRef = useRef(null)
    const uploadStl = useRef(null)
    const uploadZip = useRef(null)
    const zipFileRef = useRef(null)
    const [selectedUploadMode, setSelectedUploadMode] = useState("stl");
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedCust, setSelectedCust] = useState('');

    const handleSuggestTag = () => {
        
    }

    /**
     * This function deletes the tag clicked
     * @param {e} The event of the click 
     */
    const handleDeleteTag = (e) => {
        setTags(tags.filter(item => item !== e.target.innerHTML))
    }

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const handleSelectChange = (e) => {
        setSelectedTag(e.target.value)
    }

    const handleSelectCustChange = (e) => {
        setSelectedCust(e.target.value)
    }

    /**
     * useEffect is used to fetch the customers from the database when the component is mounted
     */
    useEffect(() => {
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ arg: 'getCustomer' }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setCustomers(data);
            })
            .catch((error) => {
                console.error('Error fetching customers:', error);
            });
    }, []);

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
                let newFile = file
                setFiles((prevFiles) => [...prevFiles,newFile])
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
        setImg(null)
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
        if(!tags.includes(selectedTag)){
            setTags((prevTags) => [...prevTags,selectedTag])
        }
    }

    const handleUpload = (e) => {

        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'setNewJob',
                username: username,
                customer_name: selectCustRef.current.value,
                name: document.getElementById("form-name").value,
                description: document.getElementById("form-desc").value,
                license: document.getElementById("license").checked ? 1 : 0,
                layer_thickness: 999,
                img_format: imgFile ? "."+imgFile.name.split(".").at(-1) : null,
                scale: document.getElementById("form-scale").value,
                color: document.getElementById("form-color").value,
                material: document.getElementById("form-material").value
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } 
            return response.json();
        }).then(data=>{
            if(data.success){
                alert("New job created with id "+data.generated_id)
                const formData = new FormData();

                formData.append("job_id",data.generated_id);

                if(imgFile){
                    console.log(imgFile)
                    formData.append('img_file', imgFile);
                }
                

                if(selectedUploadMode == "stl"){
                    files.forEach((file, index) => {
                        console.log(file)
                        formData.append('files[]', file);
                    });
                }else{
                    formData.append('zip_file', zipFile);
                }

                formData.append("type", selectedUploadMode);
                

                fetch('/3D_printer/3d_project/upload.php', {
                    method: 'POST',
                    body: formData
                })
                .then(
                    response => response.json()
                )
                .then(data => {
                    if (data.success) {
                        console.log("Files uploaded successfully:", data);
                    } else {
                        console.error("Error:", data.message);
                    }
                })
                .catch(error => console.error("Error:", error));
            }else{
                alert("Error creating job.")
                console.log(data.message)
            }
        }).catch(error => {
            console.error("Error:", error);
        });

    }

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
                                <label className="nj-label material_lbl">
                                    <b>Material</b>
                                    <input id="form-material" type="text" className="" />
                                </label>
                                <label className="license_lbl">
                                    <input id="license" type="checkbox"/>
                                    <p>Private</p>
                                </label>
                            </div>

                            <div className="nj-side-cont">
                                <div className="nj-tags">
                                    <p>Select Tags</p>
                                    <div>
                                        <select ref={selectTagRef} className="nj-select-tags" value={selectedTag} onChange={handleSelectChange}>
                                            <option value="" disabled>-- SELECT --</option>
                                            {propTags.map((tag, index) => (
                                                <option key={index} value={tag.name_tag}>{tag.name_tag}</option>
                                            ))}
                                        </select>
                                        <button className="nj-select-tags-button" onClick={() => addNewTag(selectedTag)}>Add tag</button>
                                    </div>
                                    <div className="suggest-tag-cont">
                                        <p className="small-font">No tag matches your project? </p>
                                        <p onClick={handleSuggestTag} className="small-font suggest-tag">Suggest new tag</p>
                                    </div>
                                    <div className="nj-tags-added">
                                        {tags.map((tag, index) => {
                                            return <p key={index} className="nj-tag" onClick={handleDeleteTag}>{tag}</p>
                                        }

                                        )}
                                    </div>
                                </div>
                                <div className="nj-customers">
                                    <p>Select Customer</p>
                                    <div>
                                        <select ref={selectCustRef} className="nj-select-customer" value={selectedCust} onChange={handleSelectCustChange}>
                                            <option value="" disabled>-- SELECT --</option>
                                            {customers.map((customer, index) => (
                                                <option key={index} value={customer.customer_name}>{customer.customer_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="suggest-customer-cont">
                                        <p className="small-font">Are you working for a new customer? </p>
                                        <p onClick={handleSuggestTag} className="small-font suggest-customer">Suggest new customer</p>
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