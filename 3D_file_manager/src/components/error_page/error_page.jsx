import './error_page.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
/**
 * A simple error page that appears when the user enters to a non-existing URL
 * 
 */
function Error_Page() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="error_page">
            <h2>{t("err_404")}</h2>
            <p>{t("err_404_text")}</p>
            <button onClick={handleGoHome}>{t("err_404_btn")}</button>
        </div>
    );
}

export default Error_Page;