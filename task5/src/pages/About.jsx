import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="page-wrap narrow">
      <span className="eyebrow">ABOUT ITEMFLOW</span>
      <h1>
        Good decisions start
        <br />
        <em>with a clear view.</em>
      </h1>
      <p className="lead">
        ItemFlow is a lightweight inventory workspace built to make everyday
        product management feel straightforward.
      </p>
      <div className="about-panel">
        <h2>Made for the details that matter</h2>
        <p>
          Browse products, check stock, compare categories, and understand your
          catalogue through a live dashboard. Item data comes from the project
          API and can be filtered directly from the address bar.
        </p>
        <Link className="text-link" to="/items">
          Browse inventory →
        </Link>
      </div>
    </section>
  );
}
