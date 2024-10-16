import './profile.css';
import { useEffect, useState } from 'react';

function Profile() {
    const imageLink = "https://icon.icepanel.io/Technology/svg/NixOS.svg"
    const [oldersFirst, setOldersFirst] = useState(false)
    const [buttonText, setButtonText] = useState("⯆ order by newer")
    const [jobs, setJobs] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);

    function changeOrder() {
        setOldersFirst(!oldersFirst);
        setButtonText(oldersFirst ? "⯆ order by newer" : "⯅ order by older ")
    }

    const handleShowTags = () => {
        setLoading(true);
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ arg: "getTags" })
        }
        )
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
        let jobs
        console.log("show jobs")
        setLoading(true)

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
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("Jobs:", data)
            setJobs(prevJobs => ({
                ...prevJobs,
                [tagId]: data,
            }));
            setError(null)
        } catch (error) {
            console.error('Error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleShowTags();
    }, []);

    // When tags are updated, update jobs for each tag
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
                    <div className="job_gallery_container">
                    <div className='job_content'>
                    </div>
                    <h4>job title</h4>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="profile">
            <div className='profile_left_column'>
                <img className="profile_picture" src={imageLink} alt="" />
                <h2 className='username_text'>username</h2>
                <button className='profile_button' id='button1'>edit</button>
            </div>
            <div className='profile_jobs_section'>
                <div className='profile_jobs_section_header'>
                    <h3 className='profile_jobs_section_title'>Your files</h3>
                    <button className='profile_button' id='button2'
                        onClick={changeOrder}
                    >{buttonText}</button>
                </div>

                {getJobs()}
            </div>
            {console.log("jobs is:", jobs)}
            {/* {tags.map((tag, i) => {
                console.log("tag: ");
                console.log(tag);
                console.log("i: ");
                console.log(i);
                (
                    <div className='funciona'>TRY</div>
                )
            })} */}
            {tags.map((tag) => {
                console.log(tag)
            })}
        </div>
    );
}

export default Profile;