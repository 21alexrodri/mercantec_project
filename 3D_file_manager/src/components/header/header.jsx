import './header.css';
import { useState } from "react";
import  { Login } from  '../login/login';
import { Signup } from  '../signup/signup';
function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    return (
        <header>
            <h1 className='header_title'>3D Print Archive</h1>
            <nav className='header_navbar'>
                <ul>
                    <li className='link_li'><a href='home'>Home</a></li>
                    <li className='link_li'><a href='profile'>Profile</a></li>
                    <li><button className='login_btn' onClick={() => setShowLogin(true)}>Log In</button>
                    {showLogin && <Login closeLogin={() => setShowLogin(false)} />}</li>
                    <li><button className='signup_btn' onClick={() => setShowSignup(true)}> Sign Up</button>
                    {showSignup && <Signup closeSignup={() => setShowSignup(false)} />}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;