import './popup_message.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

/**
 * 
 * @param {message} The message to be displayed in the popup. 
 * @returns A popup message that appears when the user performs an action.
 */
export const Popup = ({ message, status }) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, 100000);

        return () => clearTimeout(timeout);
    }, []);

    const closePopup = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className={`popup-message-container status_${status}`}>
            <div className="popup-message" onClick={(e) => e.stopPropagation()}>
                <div className="popup-message-header">
                    <FontAwesomeIcon icon={faTimes} className="popup-message-close" onClick={closePopup} />
                </div>
                <div className="popup-message-body">
                    <p>{message}</p>
                </div>
                <div className="progress-bar"></div>
            </div>
        </div>
    );
};