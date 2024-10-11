import './header.css';

function Header() {
    return (
        <header>
            <h1 className='header_title'>3D Print File Manager</h1>
            <nav className='header_navbar'>
                <ul>
                    <li><a href='home'>Home</a></li>
                    <li><a href='profile'>Profile</a></li>
                    <li><a href='login'>Log In</a></li>
                    <li><a href='signup'>Sign Up</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;