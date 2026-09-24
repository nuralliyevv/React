function Contact() {
    return (
        <section id="contact" className="section contact">
            <p className="section-label">CONTACT</p>

            <h2>Let's Connect</h2>

            <p>
                Feel free to find me online and explore my projects.
            </p>

            <div className="contact-links">
                <a
                    href="https://github.com/nuralliyevv"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>

                <a href="#" onClick={(e) => e.preventDefault()}>
                    Instagram
                </a>

                <span>Planet Earth 🌍</span>
            </div>
        </section>
    );
}

export default Contact;