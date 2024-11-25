import React from 'react';
import './loading_page.css'; 

const Loading = () => {
    console.log("aaaaa")
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loading;
