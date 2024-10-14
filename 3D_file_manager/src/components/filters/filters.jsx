import './filters.css';
import {useState, useEffect} from 'react';
function Filters() {
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const handleCategoryChange = (event) => {
        setSelectedTag(event.target.value);
    };
    useEffect(() => {
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setSelectedTag(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);
    return (
        <div className="filter">
        <h2>Filter</h2>
        <select value={selectedTag} onChange={handleCategoryChange}>
            <option value="">Seleccione una categoría</option>
            {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                    {tag.tag_name}
                </option>
            ))}
        </select>
    </div>
    );
}

export default Filters;