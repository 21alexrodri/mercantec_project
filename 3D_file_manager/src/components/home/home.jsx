import './home.css';
import { useState } from 'react';
import Filters from '../filters/filters'

function Home() {
    const [tags, setTags] = useState([]); 
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 

    const handleShowTags = () => {
        setLoading(true); 
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php')
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

    return (
        <div className="main_block">
        <Filters />
        <div className="home">
            <h2>Home</h2>
            <button onClick={handleShowTags}>Show Tags</button> 
        
            <div>
                {tags.length > 0 ? (
                    <ul>
                        {tags.map((tag, index) => (
                            
                            <li id={tag.id} key={index}>{tag.name_tag}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No tags to show</p> 
                )}
            </div>
        </div>
        </div>
    );
}

export default Home;
