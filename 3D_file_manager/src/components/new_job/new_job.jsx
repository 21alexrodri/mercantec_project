import React, { useCallback, useState, useEffect, useRef, useContext } from "react";
import "./new_job.css"
import { UserContext } from "../../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';

/**
 * The new job component. It is a popup that appears when the user clicks on the new job button.
 * @param {closeNewJob} a function to close the new job popup 
 * @returns A popup to create a new job
 */
export const NewJob = ({ closeNewJob, tags: propTags }) => {
    const [files, setFiles] = useState([])
    const [zipFile, setZipFile] = useState(null)
    const [imgFile, setImg] = useState(null)
    const [tags, setTags] = useState([])
    const [customers, setCustomers] = useState([])
    const [fileDetails, setFileDetails] = useState([])
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

    const handleSuggestTag = () => {}

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
        const file = e.target.files[0];
        if (file) {
            setFiles((prevFiles) => [...prevFiles, file]);
            setFileDetails((prevDetails) => [
                ...prevDetails,
                {
                    color: document.getElementById("form-color").value || "",
                    scale: document.getElementById("form-scale").value || "",
                    weight: "",
                },
            ]);
            e.target.value = "";
        }
    }

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
        const tagIds = tags.map(tag => tag.id);

        const fileDetailsArray = files.map((file, index) => ({
            name: file.name,
            color: fileDetails[index]?.color || document.getElementById("form-color").value,
            scale: fileDetails[index]?.scale || document.getElementById("form-scale").value,
            weight: fileDetails[index]?.weight || "",
        }));
        console.log(fileDetailsArray);
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
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            if (data.success) {
                alert("New job created with id " + data.generated_id);
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
                    } else {
                        console.error("Error:", data.message);
                    }
                })
                .catch(error => console.error("Error:", error));
            } else {
                alert("Error creating job.");
                console.log(data.message);
            }
        }).catch(error => {
            console.error("Error:", error);
        });
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div onClick={closeNewJob} className="blur_content">
                <div onClick={handleContainerClick} className="container">
                    <div className="new-job-header">
                        <h2>new job</h2>
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
                                <label className="name_lbl">Name</label>
                                <input id="form-name" type="text" className="name_input" placeholder="Project Name..."/>
                            </div>
                            <div className="description_box">
                                <label className="description_lbl">Description</label>
                                <textarea id="form-desc" className="description_input" placeholder="Description..." />
                            </div>
                            <div className="scale_box">
                                <label className="scale_lbl">Scale</label>
                                <input id="form-scale" type="text" className="scale_input" />
                            </div>
                            <div className="color_box">
                                <label className="color_lbl">Color</label>
                                <select name="form-color" id="form-color">
                                    <option defaultValue="undefined" value="" selected>Undefined</option>
                                    <option value="White">White</option>
                                    <option value="Black">Black</option>
                                    <option value="Red">Red</option>
                                    <option value="Green">Green</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Yellow">Yellow</option>
                                    <option value="Purple">Purple</option>
                                    <option value="Orange">Orange</option>
                                    <option value="Pink">Pink</option>
                                    <option value="Brown">Brown</option>
                                    <option value="Grey">Grey</option>
                                </select>
                            </div>
                            <div className="material_box">
                                <label className="material_lbl">Material</label>
                                <input id="form-material" type="text" className="material_input" />
                            </div>
                            <div className="licence_box">
                                <label className="licence_lbl">Private</label>
                                <input id="license" type="checkbox" />
                            </div>
                            <div className="layerThickness_box">
                                <label className="layerThickness_lbl">Layer Thickness</label>
                                <input id="form-layerThickness" type="number" min={0.01} max={1} step={0.01} />
                            </div>

                            <div className="tags_box">
                                <p className="title_tags">Select Tags</p>
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
                                    {tags.map((tag, index) => (
                                        <p key={index} className="nj-tag" onClick={() => handleDeleteTag(tag.id)}>
                                            {tag.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className="customers_box">
                                <p>Select Customer</p>
                                <div>
                                    <select ref={selectCustRef} className="nj-select-customer" value={selectedCust} onChange={handleSelectCustChange}>
                                        <option defaultValue="undefined" value="undefined" selected>Undefined</option>
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
                        <div className="lower">
                            <div className="files-upload">
                                <div className="upload-type-selector">
                                    <p ref={uploadStl} className="upload-stl selected-mode" onClick={setSelected}>Upload files</p>
                                    <p ref={uploadZip} className="upload-zip" onClick={setSelected}>Upload ZIP</p>
                                </div>
                                <ul className="files-list">
                                    {selectedUploadMode === "stl" ? (
                                        <>
                                            {files.length === 0 ? (
                                                <li className="nj-file-cont">
                                                    <p>No files yet...</p>
                                                </li>
                                            ) : (
                                                files.map((file, index) => (
                                                    <li key={index} className="nj-file-cont">
                                                        <p>{file.name}</p>
                                                        <FontAwesomeIcon icon={faTrash} cursor="pointer" onClick={() => handleDeleteFile(index)} />

                                                        <label>Color:</label>
                                                        <input
                                                            type="text"
                                                            value={fileDetails[index]?.color || ""}
                                                            onChange={(e) => {
                                                                const updatedDetails = [...fileDetails];
                                                                updatedDetails[index].color = e.target.value;
                                                                setFileDetails(updatedDetails);
                                                            }}
                                                        />

                                                        <label>Scale:</label>
                                                        <input
                                                            type="text"
                                                            value={fileDetails[index]?.scale || ""}
                                                            onChange={(e) => {
                                                                const updatedDetails = [...fileDetails];
                                                                updatedDetails[index].scale = e.target.value;
                                                                setFileDetails(updatedDetails);
                                                            }}
                                                        />

                                                        <label>Physical Weight:</label>
                                                        <input
                                                            type="number"
                                                            value={fileDetails[index]?.weight || ""}
                                                            onChange={(e) => {
                                                                const updatedDetails = [...fileDetails];
                                                                updatedDetails[index].weight = e.target.value;
                                                                setFileDetails(updatedDetails);
                                                            }}
                                                        />
                                                    </li>
                                                ))
                                            )}
                                            <li className="new-file nj-file add-button">
                                                <p>+</p>
                                                <input type="file" accept=".stl" onChange={handleFileChange} />
                                            </li>
                                        </>
                                    ) : (
                                        <div className="zip-upload-cont">
                                            <div className="zip-upload">
                                                <p>Upload</p>
                                                <input type="file" accept=".zip" onChange={handleZipUpload} />
                                            </div>
                                            <p ref={zipFileRef}>No file yet...</p>
                                            <FontAwesomeIcon ref={zipTrashRef} className="hide-trash" icon={faTrash} cursor="pointer" onClick={handleDeleteZip} />
                                        </div>
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
