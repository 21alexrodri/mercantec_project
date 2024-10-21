import './filters.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature, faCalendar, faTag, faBuilding, faPaintBrush, faPenNib} from '@fortawesome/free-solid-svg-icons';
function Filters() {
    const [tags, setTags] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedTextName, setSelectedTextName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [isDateVisible, setIsDateVisible] = useState(false);
    const [isTagVisible, setIsTagVisible] = useState(false);
    const [isColorsVisible, setIsColorsVisible] = useState(false);
    const [isCustomerVisible, setIsCustomerVisible] = useState(false);
    const [isLayerThicknessVisible, setIsLayerThicknessVisible] = useState(false);
    const [isMaterialVisible, setIsMaterialVisble] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState({ textname: '', date: '', tags: [], color: '', customer: '', minlayerthickness: '', maxlayerthickness: '', material: ''});
    
    const [minLayerThicknessValue, setMinLayerThicknessValue] = useState(0);
    const [maxLayerThicknessValue, setMaxLayerThicknessValue] = useState(100);
    const toggleTagVisibility = () => {
        setIsTagVisible(!isTagVisible);
    };
    const toggleDateVisibility = () => {
        setIsDateVisible(!isDateVisible);
    };

    const toggleColorVisibility = () => {
        setIsColorsVisible(!isColorsVisible);
    };

    const toggleCustomerVisibility = () => {
        setIsCustomerVisible(!isCustomerVisible);
    };
    const toggleLayerThicknessVisibility = () => {
        setIsLayerThicknessVisible(!isLayerThicknessVisible);
    };
    const toggleMaterialVisibility = () => {
        setIsMaterialVisble(!isMaterialVisible);
    }

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
    const handleTextChange = (event) => {
        setSelectedTextName(event.target.value);
    };
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    const handleCustomerChange = (event) => {
        setSelectedCustomer(event.target.value);
    };
    const handleMaterialChange = (event) => {
        setSelectedMaterial(event.target.value);
    };

    const handleMinChange = (event) => {
        const value = Math.min(Number(event.target.value), maxLayerThicknessValue - 1);
        setMinLayerThicknessValue(value);
    };

    const handleMaxChange = (event) => {
        const value = Math.max(Number(event.target.value), minLayerThicknessValue + 1);
        setMaxLayerThicknessValue(value);
    };


    useEffect(() => {

        setFiltersApplied({
            textname: selectedTextName,
            date: selectedDate,
            tags: selectedTags,
            color: selectedColor,
            customer: selectedCustomer,
            minlayerthickness: (minLayerThicknessValue / 100).toFixed(2),
            maxlayerthickness: (maxLayerThicknessValue / 100).toFixed(2),
            material: selectedMaterial
        });
    }, [selectedTextName, selectedDate, selectedTags, selectedColor, selectedCustomer, minLayerThicknessValue, maxLayerThicknessValue, selectedMaterial]);

    useEffect(() => {
        fetch('/3D_printer/3d_project/query.php', {
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

    const handleFormSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div className="filter">
            <h2>Filters Applied</h2>
            <div className='filters_applied'>
                {filtersApplied.textname && (
                    <div id={("name_") + filtersApplied.textname} className='filter_style'><p><FontAwesomeIcon icon={faSignature} title='Name Filter' /> {filtersApplied.textname}</p></div>
                )}
                {filtersApplied.date && (
                    <div id={("date_") + filtersApplied.date} className='filter_style'><p><FontAwesomeIcon icon={faCalendar} title='Date Filter'/> {filtersApplied.date}</p></div>    
                )}
                {filtersApplied.tags.length > 0 && filtersApplied.tags.map((tag) => (
                    <div id={("tag_") + tag} key={tag} className='filter_style'><FontAwesomeIcon icon={faTag} title='Tag filter'/> {tag}</div>
                ))}
                {filtersApplied.color && (
                    <div id={("color_") + filtersApplied.color} className='filter_style'><p><FontAwesomeIcon icon={faPaintBrush} title='Color Filter'/> {filtersApplied.color}</p></div>
                )}
                {filtersApplied.customer && (
                    <div id={("customer") + filtersApplied.customer} className='filter_style'><p><FontAwesomeIcon icon={faBuilding} title='Customer Filter'/> {filtersApplied.customer}</p></div>
                )}
                {filtersApplied.minlayerthickness > 0 && (
                    <div id={("min-layerthickness_") + filtersApplied.minlayerthickness} className='filter_style'><p><FontAwesomeIcon icon={faPenNib} /> Min. layer thickness: {filtersApplied.minlayerthickness}</p></div>
                )}
                {filtersApplied.maxlayerthickness < 1 && (
                    <div id={("max-layerthickness_") + filtersApplied.maxlayerthickness} className='filter_style'><p><FontAwesomeIcon icon={faPenNib} /> Max. layer thickness: {filtersApplied.maxlayerthickness}</p></div>
                )}
                {filtersApplied.material && (
                    <div id={(material_)+filtersApplied.material} className='filter_style'><p>{filtersApplied.material}</p></div>
                )}

            </div>

            <h2 className='filter_title'>Filters</h2>
            <form className="filter_form" onSubmit={handleFormSubmit}>
                <input
                    onChange={handleTextChange}
                    id="search_by_name"
                    type="text"
                    placeholder='Search by printjob name...'
                />
                <label className='date_label' onClick={toggleDateVisibility} style={{ cursor: 'pointer' }}>
                    Date {isDateVisible ? '▲' : '▼'}
                </label>
                <input
                    style={{ display: isDateVisible ? 'block' : 'none' }} 
                    onChange={handleDateChange}
                    id="search_by_date"
                    type="date"
                    placeholder='Search by printjob name...'
                /> 
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

                <label className='customer_label' onClick={toggleCustomerVisibility} style={{ cursor: 'pointer' }}>
                    Customer {isCustomerVisible ? '▲' : '▼'}
                </label>
                <div style={{ display: isCustomerVisible ? 'block' : 'none' }}>
                    <select name='customer_form' value={selectedCustomer} onChange={handleCustomerChange}>
                        <option value="">No customer selected</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.customer_name}>{customer.customer_name}</option>
                        ))}
                    </select>
                </div>

                <label className='color_label' onClick={toggleColorVisibility} style={{ cursor: 'pointer' }}>
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
                <label className='range_label' onClick={toggleLayerThicknessVisibility} style={{ cursor: 'pointer' }}>
                    Layer Thickness {isLayerThicknessVisible ? '▲' : '▼'}
                </label>
                <div className="range-slider" style={{ display: isLayerThicknessVisible ? 'block' : 'none' }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minLayerThicknessValue}
                        onChange={handleMinChange}
                        className="min-range"
                    />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={maxLayerThicknessValue}
                        onChange={handleMaxChange}
                        className="max-range"
                    />
                    <p>Selected Layer Thickness Range: {(minLayerThicknessValue / 100).toFixed(2)} - {(maxLayerThicknessValue / 100).toFixed(2)}</p>
                </div>
                <label className='material_label' onClick={toggleMaterialVisibility} style={{ cursor: 'pointer' }}>
                    Material {isMaterialVisible ? '▲' : '▼'}
                </label>
                <input
                    style={{ display: isMaterialVisible ? 'block' : 'none' }} 
                    onChange={handleDateChange}
                    id="search_by_material"
                    type="text"
                    placeholder='Search by material...'
                /> 
                

            </form>
        </div>
    );
}

export default Filters;
