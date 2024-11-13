import React, { useCallback, useState, useEffect, useRef, useContext } from "react";
import "./new_job.css"
import { UserContext } from "../../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

/**
 * The new job component. It is a popup that appears when the user clicks on the new job button.
 * @param {closeNewJob} a function to close the new job popup 
 * @returns A popup to create a new job
 */
export const NewJob = ({ closeNewJob, tags: propTags }) => {
    const { t } = useTranslation();
    const [files, setFiles] = useState([])
    const [zipFile, setZipFile] = useState(null)
    const [imgFile, setImg] = useState(null)
    const [tags, setTags] = useState([])
    const [customers, setCustomers] = useState([])
    const [fileDetails, setFileDetails] = useState([])
    const [showSuggestTag,setShowSuggestTag] = useState(false)
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
    const [errorMsg, setErrorMsg] = useState('');
    const handleSuggestTag = () => { }

    const handleDeleteTag = (id) => {
        setTags(tags.filter(tag => tag.id !== id));
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

    const handleDeleteFile = (indexToDelete) => {
        setFiles((prevFiles) => prevFiles.filter((file, index) => index !== indexToDelete));
        setFileDetails((prevDetails) => prevDetails.filter((_, index) => index !== indexToDelete));
    };

    const handleImgChange = (e) => {
        const img = e.target.files[0]
        if (img) {
            const reader = new FileReader();
            reader.onloadend = () => {
                imgUploadContainerRef.current.style.backgroundImage = `url(${reader.result})`;
                setImg(img)
            };
            reader.readAsDataURL(img);
        }
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const allowedExtensions = ['stl', '3mf'];
        const validFiles = [];
        const validDetails = [];
    
        selectedFiles.forEach(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (allowedExtensions.includes(fileExtension)) {
                validFiles.push(file);
                validDetails.push({
                    name: file.name.split('.').slice(0, -1).join('.'),
                    extension: fileExtension,
                    color: document.getElementById("form-color").value || "",
                    scale: document.getElementById("form-scale").value || "",
                    weight: "",
                });
            } else {
                setErrorMsg(`Error. One or more files have an invalid extension. Only .stl and .3mf files are accepted.`);
            }
        });
    
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setFileDetails((prevDetails) => [...prevDetails, ...validDetails]);
        e.target.value = "";
    };
    

    const handleFileNameChange = (index, newName) => {
        setFileDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index].name = newName;
            return updatedDetails;
        });
    };



    const handleZipUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
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
        setImg(null)
        imgUploadContainerRef.current.style.backgroundImage = "none"
    }

    const setSelected = (e) => {
        if (e.target === uploadStl.current) {
            uploadZip.current.classList.remove("selected-mode")
            setSelectedUploadMode("stl")
        } else {
            uploadStl.current.classList.remove("selected-mode")
            setSelectedUploadMode("zip")
        }
        e.target.classList.add("selected-mode")
    }

    const addNewTag = () => {
        const selectedOption = propTags.find(tag => tag.name_tag === selectedTag);
        if (selectedOption && !tags.some(tag => tag.id === selectedOption.id)) {
            setTags((prevTags) => [...prevTags, { id: selectedOption.id, name: selectedOption.name_tag }]);
        }
    }

    const handleUpload = (e) => {
        e.preventDefault();
    
        if (selectedUploadMode === "stl" && files.length === 0) {
            setErrorMsg("Please select at least one file to upload.");
            return;
        } 
        const tagIds = tags.map(tag => tag.id);
    
        const fileDetailsArray = files.map((file, index) => ({
            name: `${fileDetails[index].name}.${fileDetails[index].extension}`, 
            color: fileDetails[index]?.color || document.getElementById("form-color").value || "undefined",
            scale: parseFloat(fileDetails[index]?.scale || document.getElementById("form-scale").value || 1),
            weight: parseFloat(fileDetails[index]?.weight || 1), 
        }));
        
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
                layer_thickness: document.getElementById("form-layerThickness").value,
                img_format: imgFile ? "." + imgFile.name.split(".").at(-1) : null,
                scale: document.getElementById("form-scale").value,
                color: document.getElementById("form-color").value,
                material: document.getElementById("form-material").value,
                tags: tagIds,
                files: fileDetailsArray
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const formData = new FormData();
    
                formData.append("job_id", data.generated_id);
    
                if (imgFile) {
                    formData.append('img_file', imgFile);
                }
    
                if (selectedUploadMode === "stl") {
                    files.forEach((file) => {
                        formData.append('files[]', file);
                    });
                } else {
                    formData.append('zip_file', zipFile);
                }
    
                formData.append("type", selectedUploadMode);
    
                fetch('/3D_printer/3d_project/upload.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log("Files uploaded successfully:", data);
                        window.location.href = '/home';
                    } else {
                        setErrorMsg("Error. " + data.message);
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    window.location.href = '/home';
                });
            } else {
                setErrorMsg("Error. " + data.message);
            }
        })
        .catch(error => {
            setErrorMsg("Error. " + error);
        });
    };
    
    


    const handleFormSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div onClick={closeNewJob} className="blur_content">
                <div onClick={handleContainerClick} className="container">
                    <div className="new-job-header">
                        <h2>{t("new_job")}</h2>
                        {errorMsg && <p className="error-msg">! {errorMsg}</p>}
                    </div>
                    <form className="form-main" onSubmit={handleFormSubmit}>
                        <div className="form-container">
                            <div className="img-upload-manager">
                                <div ref={imgUploadContainerRef} className="img-upload-container">
                                    <label className="img-upload-label" htmlFor="img-upload">
                                        <FontAwesomeIcon className="upload-icon" icon={faUpload} />
                                        <input ref={fileInputRef} id="img-upload" className="img-upload" type="file" onChange={handleImgChange} accept="image/jpg, image/png, image/jpeg" />
                                    </label>
                                </div>
                                <p>* Only .jpg, .png and .jpeg accepted</p>
                                <button className="nj-delete-image" onClick={handleClearImg}>Delete image</button>
                            </div>

                            <div className="name_box">
                                <label className="name_lbl">{t("name")}</label>
                                <input id="form-name" type="text" className="name_input" placeholder="Project Name..." />
                            </div>
                            <div className="description_box">
                                <label className="description_lbl">{t("job_desc")}</label>
                                <textarea id="form-desc" className="description_input" placeholder="Description..." />
                            </div>
                            <div className="scale_box">
                                <label className="scale_lbl">{t("scale")}</label>
                                <input id="form-scale" type="number" className="scale_input" min={0.1} step={0.1} />
                            </div>
                            <div className="color_box">
                                <label className="color_lbl">{t("color")}</label>
                                <select name="form-color" id="form-color">
                                    <option defaultValue="undefined" value="" selected>{t("undefined")}</option>
                                    <option value="White">{t("white")}</option>
                                    <option value="Black">{t("black")}</option>
                                    <option value="Red">{t("red")}</option>
                                    <option value="Green">{t("green")}</option>
                                    <option value="Blue">{t("blue")}</option>
                                    <option value="Yellow">{t("yellow")}</option>
                                    <option value="Purple">{t("purple")}</option>
                                    <option value="Orange">{t("orange")}</option>
                                    <option value="Pink">{t("pink")}</option>
                                    <option value="Brown">{t("brown")}</option>
                                    <option value="Grey">{t("grey")}</option>
                                </select>
                            </div>
                            <div className="material_box">
                                <label className="material_lbl">{t("material")}</label>
                                <input id="form-material" type="text" className="material_input" />
                            </div>
                            <div className="licence_box">
                                <label className="licence_lbl">{t("private")}</label>
                                <input id="license" type="checkbox" />
                            </div>
                            <div className="layerThickness_box">
                                <label className="layerThickness_lbl">{t("layer_thickness")}</label>
                                <input id="form-layerThickness" type="number" min={0.01} max={1} step={0.01} />
                            </div>

                            <div className="tags_box">
                                <p className="title_tags">{t("sel_tags")}</p>
                                <div>
                                    <select ref={selectTagRef} className="nj-select-tags" value={selectedTag} onChange={handleSelectChange}>
                                        <option value="" disabled>-- {t("select_caps")} --</option>
                                        {propTags.map((tag, index) => (
                                            <option key={index} value={tag.name_tag}>{tag.name_tag}</option>
                                        ))}
                                    </select>
                                    <button className="nj-select-tags-button" onClick={() => addNewTag(selectedTag)}>{t("add_tag")}</button>
                                </div>
                                <div className="suggest-tag-cont">
                                    <p className="small-font">{t['no_tag_matches']}</p>
                                    <p onClick={() => {setShowSuggestTag(true)}} className="small-font suggest-tag">Suggest new tag</p>
                                </div>
                                <div className="nj-tags-added">
                                    {tags.map((tag, index) => (
                                        <p key={index} className="nj-tag" onClick={() => handleDeleteTag(tag.id)}>
                                            {tag.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className="customers_box">
                                <p>{t("select_customer")}</p>
                                <div>
                                    <select ref={selectCustRef} className="nj-select-customer" value={selectedCust} onChange={handleSelectCustChange}>
                                        <option defaultValue="undefined" value="undefined" selected>{t("undefined")}</option>
                                        {customers.map((customer, index) => (
                                            <option key={index} value={customer.customer_name}>{customer.customer_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="suggest-customer-cont">
                                    <p className="small-font">{t("new_customer")}</p>
                                    <p onClick={handleSuggestTag} className="small-font suggest-customer">{t("suggest_customer")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="lower">
                            <div className="files-upload">
                                <div className="upload-type-selector">
                                    <p ref={uploadStl} className="upload-stl selected-mode" onClick={setSelected}>{t("upload_files")}</p>
                                </div>
                                <ul className="files-list">
                                    {selectedUploadMode === "stl" ? (
                                        <>
                                            {files.length === 0 ? (
                                                <li className="nj-file-cont">
                                                    <p>{t("no_files")}</p>
                                                </li>
                                            ) : (
                                                files.map((file, index) => (
                                                    <li key={index} className="nj-file-cont">
                                                        <input
                                                            className="name_file_input"
                                                            type="text"
                                                            value={fileDetails[index]?.name || ""}
                                                            onChange={(e) => handleFileNameChange(index, e.target.value)}
                                                        />
                                                        <span>.{fileDetails[index]?.extension}</span> 
                                                        <FontAwesomeIcon icon={faTrash} cursor="pointer" onClick={() => handleDeleteFile(index)} />
                                                        
                                                        <label className="color_file_lbl">{t("color")}:</label>
                                                        <select className="color_file_select"
                                                            value={fileDetails[index]?.color || ""}
                                                            onChange={(e) => {
                                                                const updatedDetails = [...fileDetails];
                                                                updatedDetails[index].color = e.target.value;
                                                                setFileDetails(updatedDetails);
                                                            }}
                                                        >
                                                            <option value="">{t("undefined")}</option>
                                                            <option value="White">{t("white")}</option>
                                                            <option value="Black">{t("black")}</option>
                                                            <option value="Red">{t("red")}</option>
                                                            <option value="Green">{t("green")}</option>
                                                            <option value="Blue">{t("blue")}</option>
                                                            <option value="Yellow">{t("yellow")}</option>
                                                            <option value="Purple">{t("purple")}</option>
                                                            <option value="Orange">{t("orange")}</option>
                                                            <option value="Pink">{t("pink")}</option>
                                                            <option value="Brown">{t("brown")}</option>
                                                            <option value="Grey">{t("grey")}</option>
                                                        </select>

                                                        <label className="scale_file_lbl">{t("scale")}:</label>
                                                        <input
                                                            className="scale_file_input"
                                                            type="number"
                                                            value={fileDetails[index]?.scale || ""}
                                                            onChange={(e) => {
                                                                const updatedDetails = [...fileDetails];
                                                                updatedDetails[index].scale = e.target.value;
                                                                setFileDetails(updatedDetails);
                                                            }}
                                                            min={0.1} step={0.1}
                                                        />

                                                        {/* Campo para physical weight */}
                                                        <label className="physical_file_lbl">{t("physical")} {t("weight")} <span>(g)</span>:</label>
                                                        <input className="physical_file_input"
                                                            type="number"
                                                            value={fileDetails[index]?.weight || ""}
                                                            onChange={(e) => {
                                                                const updatedDetails = [...fileDetails];
                                                                updatedDetails[index].weight = e.target.value;
                                                                setFileDetails(updatedDetails);
                                                            }}
                                                            min={0.1} step={0.1}
                                                        />
                                                    </li>

                                                ))
                                            )}
                                            <li className="new-file nj-file add-button">
                                                <p>+</p>
                                                <input type="file" accept=".stl,.3mf" onChange={handleFileChange} multiple />
                                            </li>
                                        </>
                                    ) : (
                                        <div className="zip-upload-cont">
                                            <div className="zip-upload">
                                                <p>{t("upload")}</p>
                                                <input type="file" accept=".zip" onChange={handleZipUpload} />
                                            </div>
                                            <p ref={zipFileRef}>{t("no_files")}</p>
                                            <FontAwesomeIcon ref={zipTrashRef} className="hide-trash" icon={faTrash} cursor="pointer" onClick={handleDeleteZip} />
                                        </div>
                                    )}
                                </ul>
                            </div>
                            <div className="lower-right">
                                <div className="upload-options">
                                    <button className="cancel-button" onClick={closeNewJob}>{t("cancel")}</button>
                                    <button className="upload-button" onClick={handleUpload}>{t("upload")}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
