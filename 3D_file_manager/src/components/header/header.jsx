import './header.css';
import { useState, useContext } from "react";
import  { Login } from  '../login/login';
import { Signup } from  '../signup/signup';
import { UserContext } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';
import { Popup } from '../popup_message/popup_message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

/**
 * The header of the page that is shown to the user, it allows the user to navigate through the page and to log in or sign up as well as log out
 * @returns The header of the page, with two possible states, one for when the user is logged in and one for when the user is not logged in
 */
function Header() {
    const { i18n } = useTranslation();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);



    const handleUserCreated = () => {
        setShowSuccessPopup(true);
        setTimeout(() => {
            setShowSuccessPopup(false);
        }, 3000);
    };

    /**
     * This function is used to log out the user, it sends a request to the server to log out the user and updates the state of the user
     */
    const handleLogout = async () => {
        try {
            const response = await fetch('/3D_printer/3d_project/query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    arg: 'logout'
                }),
                credentials: 'include',
            });

            const data = await response.json();
            if (data.status === 'success') {
                setUsername('guest');
                setIsAdmin(false);
                setIsLogged(false);
                localStorage.clear();
                window.location.reload();
            } else {
                console.error('Error logging out:', data.message);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        console.log(i18n.language);
      };
    return (
        <>
        {!isLogged &&(
        <header>
            <div id='mercantec_header'>
            <a target='_blank' className= "logo" href="https://www.mercantec.dk/"><img id="mercantec_logo" src="/3D_printer/Files/img/logo.svg"></img></a>
            <h1 className='header_title'>3D Print Archive</h1>
            </div>
            <div className='header_left'>
            <nav className='header_navbar'>
                <ul>
                    <li className='link_li'><a href='/home'>Home</a></li>
                    <li><button className='login_btn' onClick={() => setShowLogin(true)}>Log In</button>
                    {showLogin && <Login closeLogin={() => setShowLogin(false)} />}</li>
                    <li>
                                <button className='signup_btn' onClick={() => setShowSignup(true)}> Sign Up</button>
                                {showSignup && (
                                    <Signup
                                        closeSignup={() => setShowSignup(false)}
                                        onUserCreated={handleUserCreated} 
                                    />
                                )}
                            </li>
                </ul>
            </nav>
            <div className='l_h_box'>
            {i18n.language === 'en' && (
                    <div>
                    <button className='btn_lang' onClick={() => changeLanguage('dk')}>
                        <img src="/3D_printer/Files/img/en.jpg" alt='English' />
                    </button>
                    
                </div>
                
                )}
                {i18n.language === 'dk' && (
                    <div>
                    
                    <button className='btn_lang' onClick={() => changeLanguage('en')}>
                        <img src="/3D_printer/Files/img/dk.jpg" alt='Dansk' />
                    </button>
                </div>
                
                )}
                <a className='help_direction' href='help'><FontAwesomeIcon icon={faCircleInfo} /></a>
            </div>
            </div>
            {showSuccessPopup && (
                        <Popup message="User created successfully" status="success" />
                    )}

            
        </header>
        )}
        {isLogged &&(
        <header>
            <div id='mercantec_header'>
            <a target='_blank' className= "logo" href="https://www.mercantec.dk/"><img id="mercantec_logo" src="/3D_printer/Files/img/logo.svg"></img></a>

            <h1 className='header_title'>3D Print Archive</h1>
            </div>
            <div className='header_left'> 
            <nav className='header_navbar'>
                <ul>
                    <li className='link_li'><a href='/home'>Home</a></li>
                    <li className='link_li'><a href='/profile'>Profile</a></li>
                    <button className='login_btn' onClick={handleLogout}>Log Out</button>
                </ul>
            </nav>
            <div className='l_h_box'>
                {i18n.language === 'en' && (
                    <div>
                    <button className='btn_lang' onClick={() => changeLanguage('dk')}>
                        <img src="/3D_printer/Files/img/en.jpg" alt='English' />
                    </button>
                    
                </div>
                
                )}
                {i18n.language === 'dk' && (
                    <div>
                   
                    <button className='btn_lang' onClick={() => changeLanguage('en')}>
                        <img src="/3D_printer/Files/img/dk.jpg" alt='Dansk' />
                    </button>
                </div>
                
                )}
                <a className='help_direction' href='help'><FontAwesomeIcon icon={faCircleInfo} /></a>
            </div>
            </div> 
            
        </header>
        )}


        </>
    );
}

export default Header;
