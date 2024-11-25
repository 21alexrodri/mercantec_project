import './filters.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature, faCalendar, faTag, faBuilding, faPaintBrush, faPenNib, faCube, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

/**
 * This jsx is responsible for managing the filters, allowing the users to set diferent combinations of filters in order to recover
 * the files that they are searching for. 
 * @param { onFiltersAppliedChange } - A function that is called when the filters are applied, used to update the filtersApplied state in the parent component (home.jsx)
 * @returns The filters applied by the user and the page with the filters that the user can apply
 */
function Filters({ onFiltersAppliedChange }) {
    const { t } = useTranslation();
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

    /**
     * togglevisibility functions are used to show or hide the filters that the user can apply
     */
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

    /**
     * handleChange functions are used to update the selected filters in order to apply them
     */
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

    /**
     * useEffect is used to update the filtersApplied state when the user applies a filter, saving them into an object that is sent to the parent component
     */
    useEffect(() => {
        const minLayerThickness = minLayerThicknessValue === 0 ? '' : (minLayerThicknessValue / 100).toFixed(2);
        const maxLayerThickness = maxLayerThicknessValue === 100 ? '' : (maxLayerThicknessValue / 100).toFixed(2);
    
        const newFiltersApplied = {
            textname: selectedTextName,
            date: selectedDate,
            tags: selectedTags,
            color: selectedColor,
            customer: selectedCustomer,
            minlayerthickness: minLayerThickness,
            maxlayerthickness: maxLayerThickness,
            material: selectedMaterial
        };
        setFiltersApplied(newFiltersApplied);
        console.log(newFiltersApplied);
        if (onFiltersAppliedChange) {
            onFiltersAppliedChange(newFiltersApplied);
        }
    }, [selectedTextName, selectedDate, selectedTags, selectedColor, selectedCustomer, minLayerThicknessValue, maxLayerThicknessValue, selectedMaterial]);
    
    /**
     * useEffect is used to fetch the tags and the customers from the database when the component is mounted
     */
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

    /**
     * useEffect is used to fetch the customers from the database when the component is mounted
     */
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
    const clearFilters = () => {
        setSelectedTags([]);
        setSelectedColor('');
        setSelectedTextName('');
        setSelectedDate('');
        setSelectedMaterial('');
        setSelectedCustomer('');
        setMinLayerThicknessValue(0);
        setMaxLayerThicknessValue(100);

        document.getElementById('search_by_name').value = '';
        document.getElementById('search_by_date').value = '';
        document.getElementById('search_by_material').value = '';
        document.getElementById('search_by_color').value = '';
        document.getElementById('search_by_customer').value = '';
        document.getElementById('search_by_minlayerthickness').value = 0;
        document.getElementById('search_by_maxlayerthickness').value = 100;
    };

    return (
        <div className="filter">
            <h2>{t("filters_applied")}</h2>
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
                {filtersApplied.maxlayerthickness && (
                    <div id={("max-layerthickness_") + filtersApplied.maxlayerthickness} className='filter_style'><p><FontAwesomeIcon icon={faPenNib} /> Max. layer thickness: {filtersApplied.maxlayerthickness}</p></div>
                )}
                {filtersApplied.material && (
                    <div id={("material_")+filtersApplied.material} className='filter_style'><p><FontAwesomeIcon icon={faCube} /> {filtersApplied.material}</p></div>
                )}

            </div>

            <h2 className='filter_title'>{t('filters')}</h2>
            <form className="filter_form" onSubmit={handleFormSubmit}>
                <button title='Delete all filters' className='clearFilter-button' onClick={clearFilters}><FontAwesomeIcon icon={faTrash} /></button>
                <input
                    onChange={handleTextChange}
                    id="search_by_name"
                    type="text"
                    placeholder={t('search_by_name')}
                />
                <label className='date_label' onClick={toggleDateVisibility} style={{ cursor: 'pointer' }}>
                    {t('date')} {isDateVisible ? '▲' : '▼'}
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
                        {t('tags')} {isTagVisible ? '▲' : '▼'}
                    </legend>
                    <div className='tags-filters' style={{ display: isTagVisible ? 'block' : 'none' }}>
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
                    {t('customer')} {isCustomerVisible ? '▲' : '▼'}
                </label>
                <div style={{ display: isCustomerVisible ? 'block' : 'none' }}>
                    <select id='search_by_customer' name='customer_form' value={selectedCustomer} onChange={handleCustomerChange}>
                        <option value="">{t('no_customer_selected')}</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.customer_name}>{customer.customer_name}</option>
                        ))}
                    </select>
                </div>

                <label className='color_label' onClick={toggleColorVisibility} style={{ cursor: 'pointer' }}>
                    {t('colors')} {isColorsVisible ? '▲' : '▼'}
                </label>

                <div style={{ display: isColorsVisible ? 'block' : 'none' }}>
                    <select id="search_by_color" name="colors_form" value={selectedColor} onChange={handleColorChange}>
                        <option value=''>{t("no_color_selected")}</option>
                        <option value='red'>{t("red")}</option>
                        <option value='blue'>{t("blue")}</option>
                        <option value='green'>{t("green")}</option>
                        <option value='purple'>{t("purple")}</option>
                        <option value='pink'>{t("pink")}</option>
                        <option value='yellow'>{t("yellow")}</option>
                        <option value='orange'>{t("orange")}</option>
                        <option value='brown'>{t("brown")}</option>
                        <option value='grey'>{t("grey")}</option>
                        <option value='white'>{t("white")}</option>
                        <option value='black'>{t("black")}</option>
                    </select>
                </div>
                <label className='range_label' onClick={toggleLayerThicknessVisibility} style={{ cursor: 'pointer' }}>
                    {t("layer_thickness")} {isLayerThicknessVisible ? '▲' : '▼'}
                </label>
                <div className="range-slider" style={{ display: isLayerThicknessVisible ? 'block' : 'none' }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minLayerThicknessValue}
                        onChange={handleMinChange}
                        className="min-range"
                        id='search_by_minlayerthickness'
                    />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={maxLayerThicknessValue}
                        onChange={handleMaxChange}
                        className="max-range"
                        id='search_by_maxlayerthickness'
                    />
                    <p>{t("layer_thickness_range")}: {(minLayerThicknessValue / 100).toFixed(2)} - {(maxLayerThicknessValue / 100).toFixed(2)}</p>
                </div>
                <label className='material_label' onClick={toggleMaterialVisibility} style={{ cursor: 'pointer' }}>
                    {t("material")} {isMaterialVisible ? '▲' : '▼'}
                </label>
                <input
                    style={{ display: isMaterialVisible ? 'block' : 'none' }} 
                    onChange={handleMaterialChange}
                    id="search_by_material"
                    type="text"
                    placeholder='Search by material...'
                /> 
                

            </form>
        </div>
    );
}

export default Filters;
