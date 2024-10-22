import './profile.css';
import { useEffect, useState } from 'react';
import  {UserTable } from  '../users_table/users_table';

function Profile() {
    const imageLink = "/3D_printer/Files/img/default-job.png";
    const [recentsFirst, setRecentsFirst] = useState(false);
    const [buttonText, setButtonText] = useState("⯆ recents first");
    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);
    const [username, setUsername] = useState("guest");  
    const [isAdmin, setIsAdmin] = useState(false);  
    const [showUserTable, setShowUserTable] = useState(false);

    function changeOrder() {
        setRecentsFirst(!recentsFirst);
        setButtonText(recentsFirst ? "⯆ recents first" : "⯅ olders first ");
    }

    const checkUserStatus = async () => {
        try {
            const response = await fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    arg: 'checkUserLoggedIn'
                }),
                credentials: 'include', 
            });
    
            const text = await response.text(); 
            console.log('Respuesta recibida del servidor:', text);
    
            if (text.trim() === "") {
                throw new Error("Respuesta vacía desde el servidor.");
            }
    
            const data = JSON.parse(text);
            if (data.status === "success") {
                setUsername(data.username || "guest");
                setIsAdmin(data.is_admin === 1);
            } else {
                setUsername("guest");
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking user status:', error);
            setUsername("guest");
            setIsAdmin(false);
        }
    };
    

    const handleShowTags = () => {
        setLoading(true);
        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ arg: "getTags" }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTags(data);
                setError(null);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    async function handleShowJobs(tagId, offset) {
        console.log("show jobs");
        setLoading(true);

        try {
            const response = await fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    arg: "getJobs",
                    tag_id: tagId,
                    offset: offset,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Jobs:", data);
            setJobs(prevJobs => ({
                ...prevJobs,
                [tagId]: data,
            }));
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    
    useEffect(() => {
        checkUserStatus();
        handleShowTags();
    }, []);

    
    useEffect(() => {
        if (tags.length > 0) {
            tags.forEach(tag => {
                handleShowJobs(tag.id, 0);
            });
        }
    }, [tags]);

    function getJobs() {
        if (recentsFirst) {
            return (
                <div className="job_gallery">
                    {tags.map((tag) => (
                        <div className="job_gallery_container" key={tag.id}>
                            <div className="job_content">
                                <img src={imageLink} alt="" />
                            </div>
                            <h4>job title {tag.id}</h4>
                        </div>
                    )).reverse()}
                </div>
            );
        } else {
            return (
                <div className="job_gallery">
                    {tags.map((tag) => (
                        <div className="job_gallery_container" key={tag.id}>
                            <div className="job_content">
                                <img src={imageLink} alt="" />
                            </div>
                            <h4>job title {tag.id}</h4>
                        </div>
                    ))}
                </div>
            );
        }
    }

    
    const handleEditClick = () => {
        setShowUserTable(true)
        
        if (isAdmin) {
            console.log("You are an admin");
        } else {
            console.log("No admin");
        }
    };

    return (
        <div className="profile_page">
            <div className="profile_left_column">
                <img className="profile_picture" src={imageLink} alt="" />
                <h2 className="username_text">{username}</h2> 
                <button className="profile_button" id="button1" onClick={handleEditClick}>
                    edit
                </button>
            
                {showUserTable && <UserTable closeUserTable={() => setShowUserTable(false)} />}
            </div>
            <div className="profile_jobs_section">
                <div className="profile_jobs_section_header">
                    <h3 className="profile_jobs_section_title">Your files</h3>
                    <button className="profile_button" id="button2" onClick={changeOrder}>
                        {buttonText}
                    </button>
                </div>
                {getJobs()}
            </div>
        </div>
    );
}

export default Profile;
