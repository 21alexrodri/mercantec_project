import './header.css';
import { useState, useContext } from "react";
import  { Login } from  '../login/login';
import { Signup } from  '../signup/signup';
import { UserContext } from '../../context/UserContext';

function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const { username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);

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
    return (
        <>
        {!isLogged &&(
        <header>
            <div id='mercantec_header'>
            <a target='_blank' className= "logo" href="https://www.mercantec.dk/"><img id="mercantec_logo" src="/3D_printer/Files/img/logo.svg"></img></a>
            <h1 className='header_title'>3D Print Archive</h1>
            </div>
            <nav className='header_navbar'>
                <ul>
                    <li className='link_li'><a href='/home'>Home</a></li>
                    <li><button className='login_btn' onClick={() => setShowLogin(true)}>Log In</button>
                    {showLogin && <Login closeLogin={() => setShowLogin(false)} />}</li>
                    <li><button className='signup_btn' onClick={() => setShowSignup(true)}> Sign Up</button>
                    {showSignup && <Signup closeSignup={() => setShowSignup(false)} />}
                    </li>
                </ul>
            </nav>
        </header>
        )}
        {isLogged &&(
        <header>
            <div id='mercantec_header'>
            <a target='_blank' className= "logo" href="https://www.mercantec.dk/"><img id="mercantec_logo" src="/3D_printer/Files/img/logo.svg"></img></a>
            <h1 className='header_title'>3D Print Archive</h1>
            </div>
            <nav className='header_navbar'>
                <ul>
                    <li className='link_li'><a href='/home'>Home</a></li>
                    <li className='link_li'><a href='/profile'>Profile</a></li>
                    <button className='login_btn' onClick={handleLogout}>Log Out</button>
                </ul>
            </nav>
        </header>
        )}


        </>
    );
}

export default Header;