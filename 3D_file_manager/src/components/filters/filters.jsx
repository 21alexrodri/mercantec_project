import './filters.css';
import {useState, useEffect} from 'react';
function Filters() {
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [isTagVisible, setIsTagVisible] = useState(false)
    const [isColorsVisible, setIsColorsVisible] = useState(false)
    const handleCategoryChange = (event) => {
        setSelectedTag(event.target.value);
    };
    const toggleTagVisibility = () => {
        setIsTagVisible(!isTagVisible);
    }
    const toggleColorVisibility = () => {
        setIsColorsVisible(!isColorsVisible);
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
               
                <legend onClick={toggleTagVisibility} style={{cursor: 'pointer'}}>
                    Tags {isTagVisible ? '▲' : '▼'}
                </legend>
                
                {isTagVisible && (
                    tags.map((tag) => (
                        <div key={tag.id}>
                            <input type="checkbox" id={tag.id} name={tag.id}/>
                            <label className='fieldset_labels' htmlFor={tag.id}>{tag.name_tag}</label>
                        </div>
                    ))
                )}
            </fieldset>
            <label className='color_label' onClick={toggleColorVisibility} style={{cursor: 'pointer'}} for="colors_form">
                Colors {isColorsVisible ? '▲' : '▼'}
            </label>
            {isColorsVisible &&
            ( 
            <select name="colors_form" >
            <option selected value=''>No color selected</option>
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
            )
            }
        </form>
    </div>
    );
}

export default Filters;