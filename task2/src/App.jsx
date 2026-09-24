import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Contact from "./components/Contact";

function App() {
    return (
        <div className="app">
            <Navbar />

            <main>
                <Hero />
                <About />
                <Skills />
                <Contact />
            </main>
        </div>
    );
}

export default App;