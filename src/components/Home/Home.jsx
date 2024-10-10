import { useShallow } from 'zustand/react/shallow'
import { Link } from 'react-router-dom'
import { useStore } from "../../store"
import { Posts } from '../Posts/'
import { Eye, Collab, Voice, HappyFace } from "../Icons"
import './Home.css'

export function Home() {
    const { searchSelectedItem } = useStore(
        useShallow((state) => ({
            searchSelectedItem: state.searchSelectedItem,
        }))
    );

    const scrollToSection = () => {
        const section = document.getElementById("about-platform");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className='home'>
            {searchSelectedItem ? <Posts /> : (
                <>
                    <main>
                        <section className="hero">
                            <div className="container">
                                <h1>Welcome to Campus Voices</h1>
                                <p>Empowering university communities to address challenges and drive positive change through open dialogue and collaborative problem-solving.</p>
                                <div className="cta-buttons">
                                    <Link to='/signup'>
                                        <button className="btn primary">Join Now</button>
                                    </Link>
                                    <button onClick={scrollToSection} className="btn secondary">Learn More</button>
                                </div>
                            </div>
                        </section>
                        <section className="why-use">
                            <div className="container">
                                <h2>Why Use Campus Voices?</h2>
                                <div className="card-grid">
                                    <div className="card">
                                        <Voice />
                                        <h3>Amplify Your Voice</h3>
                                        <p>Bridge the gap between those affected by issues and those with the power to implement changes.</p>
                                    </div>
                                    <div className="card">
                                        <Collab />
                                        <h3>Foster Collaboration</h3>
                                        <p>Engage in meaningful discussions with fellow students, faculty, and administrators to find solutions together.</p>
                                    </div>
                                    <div className="card">
                                        <HappyFace />
                                        <h3>Drive Positive Change</h3>
                                        <p>Contribute to a culture of advocacy, inclusion, and accountability within your university community.</p>
                                    </div>
                                    <div className="card">
                                        <Eye />
                                        <h3>Increase Transparency</h3>
                                        <p>Gain visibility into shared issues and the impact they have on the campus community.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section id="about-platform" className="about-platform">
                            <div className="container">
                                <h2>About Our Platform</h2>
                                <p>Campus Voices is born from the recognition of the challenges university environments face and the urgent need for effective solutions. We aim to empower all stakeholders - students, faculty, and administrators alike - to actively engage in collaborative problem-solving through open dialogue and constructive feedback mechanisms.</p>
                                <p>Our platform complements existing complaint and resolution processes, serving as an accessible space for the university community to express concerns without obstacles. By fostering a culture of open communication and providing visibility into the impact of campus issues, we enable informed decision-making and support the resolution process.</p>
                            </div>
                        </section>
                    </main>
                    <footer>
                        <nav>
                            <a href="#">Terms of Service</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Help Us Improve</a>
                        </nav>
                    </footer>
                </>
            )}
        </div>
    )
}
