function Navbar() {
    return (
        <nav className="navbar">
            <a href="#" className="logo">
                MN<span>.</span>
            </a>

            <div className="nav-links">
                <a href="#about">About</a>
                <a href="#skills">Skills</a>
                <a href="#contact">Contact</a>
            </div>

            <a href="#contact" className="nav-button">
                Let's talk
            </a>
        </nav>
    );
}

export default Navbar;