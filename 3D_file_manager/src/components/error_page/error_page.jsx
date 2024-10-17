import './error_page.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Error_Page() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="error_page">
            <h2>Error 404</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <button onClick={handleGoHome}>Go back to the homepage</button>
        </div>
    );
}

export default Error_Page;