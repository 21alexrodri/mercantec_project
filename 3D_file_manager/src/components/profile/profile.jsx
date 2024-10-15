import './profile.css';

function Profile() {
    return (
        <div className="profile">
            <div className='profile_left_column'>
                <img className="profile_picture" src="" alt="" />
                <h2 className='username_text'>username</h2>
                <button className='profile_button' id='button1'>hi</button>
            </div>
            <div className='profile_jobs_section'>
                <h3 className='profile_jobs_section_title'>Your files</h3>
                <button className='profile_button' id='button2'>hi</button>
            </div>
        </div>
    );
}

export default Profile;