import './header.css';
import { useState } from 'react';

function Header() {


    return (
        <header>
            <h1 className='header_title'>3D Print File Manager</h1>
            <nav className='header_navbar'>
                <ul>
                    <li><a href=''>Home</a></li>
                    <li><a href=''>Profile</a></li>
                    <li><a href=''>Log In</a></li>
                    <li><a href=''>Sign Up</a></li>
                </ul>
            </nav>
        </header>
    );
    }

export default Header;