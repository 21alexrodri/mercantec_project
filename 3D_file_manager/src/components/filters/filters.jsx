import './filters.css';
import { useState, useEffect } from 'react';

function Filters() {
    const [tags, setTags] = useState([]); 
    const [selectedTags, setSelectedTags] = useState([]); 
    const [selectedColor, setSelectedColor] = useState(''); 
    const [isTagVisible, setIsTagVisible] = useState(false); 
    const [isColorsVisible, setIsColorsVisible] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState({ tags: '', color: '' }); 

    const toggleTagVisibility = () => {
        setIsTagVisible(!isTagVisible);
    };

    const toggleColorVisibility = () => {
        setIsColorsVisible(!isColorsVisible);
    };

    const handleTagChange = (event) => {
        const tag = event.target.value;
        const checked = event.target.checked;

        if (checked) {
            setSelectedTags((prevTags) => [...prevTags, tag]); 
        } else {
            setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
        }
    };

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value); 
    };

    useEffect(() => {
        setFiltersApplied({
            tags: selectedTags.join(', '),
            color: selectedColor,
        });
    }, [selectedTags, selectedColor]);

    useEffect(() => {
        fetch('http://192.168.116.229/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ arg: 'getTags' }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setTags(data); 
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <div className="filter">
            <h2>Filters Applied</h2>
            <div className='filters_applied'>
                {filtersApplied.tags && (
                    <div className='filter_style'><p>{filtersApplied.tags}</p></div>
                )}
                {filtersApplied.color && (
                    <div className='filter_style'><p>{filtersApplied.color}</p></div>
                )}
                
            </div>

            <h2 className='filter_title'>Filters</h2>
            <form className="filter_form">
                <fieldset>
                    <legend onClick={toggleTagVisibility} style={{ cursor: 'pointer' }}>
                        Tags {isTagVisible ? '▲' : '▼'}
                    </legend>
                    <div style={{ display: isTagVisible ? 'block' : 'none' }}>
                        {tags.map((tag) => (
                            <div key={tag.id}>
                                <input
                                    type="checkbox"
                                    id={tag.id}
                                    value={tag.name_tag}
                                    checked={selectedTags.includes(tag.name_tag)} 
                                    onChange={handleTagChange}
                                />
                                <label className='fieldset_labels' htmlFor={tag.id}>{tag.name_tag}</label>
                            </div>
                        ))}
                    </div>
                </fieldset>

                <label
                    className='color_label'
                    onClick={toggleColorVisibility}
                    style={{ cursor: 'pointer' }}
                >
                    Colors {isColorsVisible ? '▲' : '▼'}
                </label>

                
                <div style={{ display: isColorsVisible ? 'block' : 'none' }}>
                    <select name="colors_form" value={selectedColor} onChange={handleColorChange}>
                        <option value=''>No color selected</option>
                        <option value='red'>Red</option>
                        <option value='blue'>Blue</option>
                        <option value='green'>Green</option>
                        <option value='purple'>Purple</option>
                        <option value='pink'>Pink</option>
                        <option value='yellow'>Yellow</option>
                        <option value='white'>White</option>
                        <option value='black'>Black</option>
                        <option value='grey'>Grey</option>
                        <option value='orange'>Orange</option>
                        <option value='brown'>Brown</option>
                    </select>
                </div>

            </form>
        </div>
    );
}

export default Filters;
