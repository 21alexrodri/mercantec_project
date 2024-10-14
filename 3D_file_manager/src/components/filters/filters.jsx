import './filters.css';
import {useState, useEffect} from 'react';
function Filters() {
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const handleCategoryChange = (event) => {
        setSelectedTag(event.target.value);
    };
    useEffect(() => {
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({arg: "getTags"})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTags(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);
    return (
        <div className="filter">
        <h2>Filter</h2>
        <form className="filter_form">
        <fieldset>
            <legend>Tags</legend>
            {tags.map((tag) => (
              <div>
              <input type="checkbox" key={tag.id} id={tag.id} name={tag.id}/>
              <label className='fieldset_labels' for={tag.id}>{tag.name_tag}</label>
              </div>  
            ))}
        </fieldset>
        </form>
    </div>
    );
}

export default Filters;