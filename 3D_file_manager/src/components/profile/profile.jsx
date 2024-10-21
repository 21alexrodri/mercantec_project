import './profile.css';
import { useEffect, useState } from 'react';

function Profile() {
    const imageLink = "http://192.168.116.229/3D_printer/Files/img/default-job.png";
    const [recentsFirst, setRecentsFirst] = useState(false);
    const [buttonText, setButtonText] = useState("⯆ recents first");
    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);
    const [username, setUsername] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ arg: "getUserSession" }),
                    credentials: 'include'
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json();
        
                if (data.status === "success") {
                    console.log("Datos de la sesión:", data);
                    setUsername(data.user.username);
                    setIsAdmin(data.user.is_admin === 1);
                } else {
                    console.log("No hay sesión activa", data);
                    setUsername("Guest");
                }
            } catch (error) {
                console.error("Error al verificar la sesión:", error);
                setUsername("Guest");
            }
        };        
    
        checkSession();
    }, []);
    

    function changeOrder() {
        setRecentsFirst(!recentsFirst);
        setButtonText(recentsFirst ? "⯆ recents first" : "⯅ olders first ");
    }

    const handleShowTags = () => {
        setLoading(true);
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ arg: "getTags" })
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
        setLoading(true);
        try {
            const response = await fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    arg: "getJobs",
                    tag_id: tagId,
                    offset: offset
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
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
        return (
            <div className='job_gallery'>
                {tags.map((tag) => (
                    <div className="job_gallery_container" key={tag.id}>
                        <div className='job_content'>
                            <img src={imageLink} alt="" />
                        </div>
                        <h4>job title {tag.id}</h4>
                    </div>
                )).reverse()}
            </div>
        );
    }

    function handleEditClick() {
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ arg: "isAdmin" }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                console.log("Eres admin");
            } else {
                console.log("No tienes permisos para editar");
            }
        })
        .catch(error => console.error('Error:', error));
    }
    
    

    return (
        <div className="profile">
            <div className='profile_left_column'>
                <img className="profile_picture" src={imageLink} alt="" />
                <h2 className='username_text'>{username ? username : "Guest"}</h2>
                <button className='profile_button' id='button1' onClick={handleEditClick}>edit</button>
            </div>
            <div className='profile_jobs_section'>
                <div className='profile_jobs_section_header'>
                    <h3 className='profile_jobs_section_title'>Your files</h3>
                    <button className='profile_button' id='button2' onClick={changeOrder}>{buttonText}</button>
                </div>

                {getJobs()}
            </div>
        </div>
    );
}

export default Profile;
