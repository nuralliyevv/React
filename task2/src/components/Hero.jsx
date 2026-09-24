function Hero() {
    return (
        <section className="hero">
            <div className="hero-text">
                <p className="hello">HELLO, I'M</p>

                <h1>Miras Nuraliyev</h1>

                <h2>Information Systems Student</h2>

                <p className="hero-description">
                    I am a university student interested in software
                    development and modern web technologies.
                </p>

                <div className="hero-buttons">
                    <a href="#about" className="btn primary">
                        About Me
                    </a>

                    <a href="#contact" className="btn secondary">
                        Contact
                    </a>
                </div>
            </div>

            <div className="hero-image">
                <img
                    src="photo.jpg"
                    alt="Profile"
                />
            </div>
        </section>
    );
}

export default Hero;