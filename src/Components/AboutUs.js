import React from 'react';
import {Link} from 'react-router-dom';

function AboutUs() {
  return (
    <main className="info-page">
      <header className="info-hero">
        <p className="info-eyebrow">ABOUT INDIA SPEAKS</p>
        <h1>News discovery, made easier.</h1>
        <p className="info-hero__intro">
          A simple place to explore stories from India and around the world, across the topics that matter
          to you.
        </p>
      </header>

      <div className="about-grid">
        <section className="info-card about-story">
          <span className="info-card__icon" aria-hidden="true">
            IS
          </span>
          <div>
            <p className="info-eyebrow">OUR PURPOSE</p>
            <h2>A clearer way to catch up</h2>
            <p>
              India Speaks brings news discovery into one straightforward experience. Browse by topic,
              search for a subject, or scan a short list of Google News headlines.
            </p>
            <p>
              Stories are sourced from external news services and published by their respective publishers.
              We link you to those publishers for the full article; India Speaks is a discovery experience,
              not a claim that we reported or independently verified every story.
            </p>
          </div>
        </section>

        <section className="info-card about-principles">
          <p className="info-eyebrow">WHAT YOU CAN EXPECT</p>
          <h2>Built around the reader</h2>
          <ul className="info-check-list">
            <li>Browse a range of news topics in one place.</li>
            <li>Search for the subjects and stories you care about.</li>
            <li>Follow links to the original publisher for more context.</li>
            <li>Use a responsive experience on mobile, tablet, or desktop.</li>
          </ul>
          <Link className="about-guide-link" to="/news-literacy">
            Read our guide to evaluating news <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>

      <section className="info-card about-founder">
        <span className="about-founder__mark" aria-hidden="true">
          HK
        </span>
        <div>
          <p className="info-eyebrow">THE PERSON BEHIND THE PROJECT</p>
          <h2>Built by Harsh Kalmegh</h2>
          <p>
            India Speaks is an independent project created by a software developer with a passion for
            building useful digital experiences.
          </p>
        </div>
      </section>

      <section className="info-card about-contact">
        <div>
          <p className="info-eyebrow">GET IN TOUCH</p>
          <h2>Have a question or suggestion?</h2>
          <p>We welcome feedback that helps make India Speaks more useful.</p>
        </div>
        <Link className="info-button" to="/contact-us">
          Contact us <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}

export default AboutUs;
