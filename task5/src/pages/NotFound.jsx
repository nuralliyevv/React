import { Link } from "react-router-dom";
export default function NotFound() { return <section className="not-found"><span className="eyebrow">ERROR / 404</span><h1>This page is<br/><em>out of stock.</em></h1><p>The address may be incorrect or the page may have moved.</p><Link className="button button-primary" to="/">Back to home →</Link></section>; }
