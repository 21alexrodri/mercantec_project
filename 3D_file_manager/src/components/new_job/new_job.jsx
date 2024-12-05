import React, { useCallback, useState, useEffect, useRef, useContext } from "react";
import "./new_job.css"
import { UserContext } from "../../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Popup } from '../popup_message/popup_message';

/**
 * The new job component. It is a popup that appears when the user clicks on the new job button.
 * @param {closeNewJob} a function to close the new job popup 
 * @returns A popup to create a new job
 */
export const NewJob = ({ closeNewJob, tags: propTags, disableBackgroundFocus }) => {
    const { t } = useTranslation();
    const [files, setFiles] = useState([])
    const [zipFile, setZipFile] = useState(null)
    const [imgFile, setImg] = useState(null)
    const [tags, setTags] = useState([])
    const [customers, setCustomers] = useState([])
    const [fileDetails, setFileDetails] = useState([])
    const [showSuggestTag, setShowSuggestTag] = useState(false)
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
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);
    const originalTabIndexes = useRef(new Map());
    const handleSuggestTag = () => { }
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);


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
        if (disableBackgroundFocus) {
            const focusableElements = document.querySelectorAll(
                "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])"
            );

            focusableElements.forEach((el) => {
                if (!popupRef.current.contains(el)) {
                    originalTabIndexes.current.set(el, el.getAttribute("tabindex"));
                    el.setAttribute("tabindex", "-1");
                }
            });
        }

        return () => {

            originalTabIndexes.current.forEach((value, el) => {
                if (value === null) {
                    el.removeAttribute("tabindex");
                } else {
                    el.setAttribute("tabindex", value);
                }
            });
            originalTabIndexes.current.clear();
        };
    }, [disableBackgroundFocus]);

    useEffect(() => {
        const focusablePopupElements = popupRef.current.querySelectorAll(
            "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        if (focusablePopupElements.length > 0) {
            focusablePopupElements[0].focus();
        }
    }, []);
    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            const focusablePopupElements = popupRef.current.querySelectorAll(
                "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])"
            );
            const firstElement = focusablePopupElements[0];
            const lastElement = focusablePopupElements[focusablePopupElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        } else if (e.key === "Escape") {
            closeNewJob();
        }
    };


    /**
     * Gets the customers from the database in order to select one when creating a new job
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

    /**
     * Handles the file change event. It checks if the files have the correct extension and adds them to the state.
     * @param {e} the event that triggered the file change 
     */
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
                setShowPopup(true);
                setErrorMsg(`Error. One or more files have an invalid extension. Only .stl and .3mf files are accepted.`);
                setTimeout(() => setShowPopup(false), 3000);
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


    /**
     * Used to handle the upload of a zip file containing multiple files (at this moment not implemented)
     * @param {e} the event that triggered the file change 
     */
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

    /**
     * Adds a new tag to the list of tags
     */
    const addNewTag = () => {
        const selectedOption = propTags.find(tag => tag.name_tag === selectedTag);
        if (selectedOption && !tags.some(tag => tag.id === selectedOption.id)) {
            setTags((prevTags) => [...prevTags, { id: selectedOption.id, name: selectedOption.name_tag }]);
        }
    }

    /**
     * Handles the upload of the job. It sends the job details to the server and then uploads the files.
     * @param {e} the event that triggered the upload 
     * @returns The uploaded job
     */
    const handleUpload = (e) => {
        e.preventDefault();

        if (selectedUploadMode === "stl" && files.length === 0) {
            setShowPopup(true);
            setErrorMsg("Please select at least one file to upload.");
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }
        setIsLoading(true);

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

                    files.forEach((file) => {
                        console.log(file)

                        formData.append('files[]', file);

                    });

                    formData.append("type", selectedUploadMode);

                    fetch('/3D_printer/3d_project/upload_adrian.php', {
                        method: 'POST',
                        body: {
                            files: files,
                            job_id: data.generated_id,
                            img_file: imgFile
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                setIsUploaded(true);
                                //console.log("Files uploaded successfully:", data);
                                window.location.href = '/home';
                                
                            } else {
                                setShowPopup(true);
                                setErrorMsg("Error. " + data.message);
                                setTimeout(() => setShowPopup(false), 3000);
                            }
                        })
                        .catch(error => {
                            setIsUploaded(true);
                            console.error("Error:", error);
                            window.location.href = '/home';
                            
                        });
                } else {
                    setShowPopup(true);
                    setErrorMsg("Error. " + data.message);
                    setTimeout(() => setShowPopup(false), 3000);
                }
            })
            .catch(error => {
                setShowPopup(true);
                setErrorMsg("Error. " + error);
                setTimeout(() => setShowPopup(false), 3000);
            });
    };




    const handleFormSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div onClick={closeNewJob} className="blur_content">
                <div
                    ref={popupRef}
                    onClick={(e) => e.stopPropagation()}
                    className="container"
                    onKeyDown={handleKeyDown}
                >
                    <div className="new-job-header">
                        <h2>{t("new_job")}</h2>
                        <p onClick={closeNewJob} tabIndex="0" onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                closeNewJob();
                            }
                        }}>X</p>
                    </div>
                    {!isUploaded ? (
                        <form className="form-main" onSubmit={handleFormSubmit}>
                        <div className="form-container">
                            <div className="img-upload-manager">
                                <div ref={imgUploadContainerRef} className="img-upload-container">
                                    <label className="img-upload-label" htmlFor="img-upload">
                                        <FontAwesomeIcon className="upload-icon" icon={faUpload} />
                                        <input ref={fileInputRef} id="img-upload" className="img-upload" type="file" onChange={handleImgChange} accept="image/jpg, image/png, image/jpeg" />
                                    </label>
                                </div>
                                <p>{t("nj_only")}</p>
                                <button className="nj-delete-image" onClick={handleClearImg}>{t("del_img")}</button>
                            </div>

                            <div className="name_box">
                                <label className="name_lbl">{t("name")}</label>
                                <input id="form-name" type="text" className="name_input" placeholder={t("project_name")+"... *"} maxLength="30" />
                            </div>
                            <div className="description_box">
                                <label className="description_lbl">{t("job_desc")}</label>
                                <textarea id="form-desc" className="description_input" placeholder={t("description")+"... *"} />
                            </div>
                            <div className="scale_box">
                                <label className="scale_lbl">{t("scale")} *</label>
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
                                <label className="layerThickness_lbl">{t("layer_thickness")}(mm) *</label>
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
                                    <p onClick={() => { setShowSuggestTag(true) }} className="small-font suggest-tag"><a href="/profile">{t("suggest-tag")}</a></p>
                                </div>
                                <div className="nj-tags-added">
                                    {tags.map((tag, index) => (
                                        <p key={index} className="nj-tag" tabIndex="0" onClick={() => handleDeleteTag(tag.id)} onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleDeleteTag(tag.id);
                                            }
                                        }}>
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
                                    <p onClick={handleSuggestTag} className="small-font suggest-customer">
                                        <a href="/profile">{t("suggest_customer")}</a>
                                    </p>
                                </div>
                                <p className="req_field">* {t("nj_required_field")}</p>
                            </div>
                        </div>
                        <div className="lower">
                            <div className="files-upload">
                                <div className="upload-type-selector">
                                    <p ref={uploadStl} className="upload-stl selected-mode" onClick={setSelected}>{t("upload_files")} *</p>
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

                                                        <label className="scale_file_lbl">{t("scale")}: *</label>
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
                                                <input type="file" accept=".stl,.3mf" onChange={handleFileChange} multiple className="upload-files-btn" />
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
                        {showPopup && (
                            <Popup message={errorMsg} status="warning" />
                        )}
                    </form>

                    ) : (
                        <div className="checked_job">
                            <FontAwesomeIcon icon={faCheck} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
