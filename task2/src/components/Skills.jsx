function Skills() {
    const skills = [
        "React",
        "Java",
        "Python",
        "JavaScript",
        "PostgreSQL",
        "Git"
    ];

    return (
        <section id="skills" className="section">
            <p className="section-label">SKILLS</p>

            <h2>Technologies I Work With</h2>

            <div className="skills-container">
                {skills.map((skill) => (
                    <div className="skill-card" key={skill}>
                        {skill}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Skills;