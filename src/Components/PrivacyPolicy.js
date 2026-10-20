import React from 'react';
import {Link} from 'react-router-dom';

const sections = [
  ['information', 'Information and how it is used'],
  ['services', 'Third-party services'],
  ['choices', 'Your choices'],
  ['security', 'Security and links'],
  ['changes', 'Policy updates'],
];

function PrivacyPolicy() {
  return (
    <main className="info-page privacy-page">
      <header className="info-hero">
        <p className="info-eyebrow">YOUR PRIVACY</p>
        <h1>Privacy policy</h1>
        <p className="info-hero__intro">
          A plain-language overview of what happens when you use India Speaks.
        </p>
        <p className="privacy-updated">Last updated: 20 October 2026</p>
      </header>

      <div className="privacy-layout">
        <nav className="info-card privacy-toc" aria-label="Privacy policy sections">
          <h2>On this page</h2>
          <ul>
            {sections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="info-card privacy-content">
          <p className="privacy-summary">
            India Speaks is a news discovery website. This policy explains the information involved in
            loading news, using search, and contacting us. The app does not provide user accounts or accept
            payments.
          </p>

          <section id="information">
            <h2>Information and how it is used</h2>
            <p>
              When you browse news or search, your browser requests content from the services that provide
              the app’s news, headlines, and trends. Those requests may include standard technical
              information such as your IP address, browser, and the requested content. Search terms are sent
              to the news service to retrieve matching stories.
            </p>
            <p>
              If you use the contact form, it prepares an email using your device’s email application. The
              site does not submit the form to its own message server. Any information you choose to include
              will be handled by your email provider and the recipient once you send it.
            </p>
            <p>
              We have not found app-managed account profiles, payment collection, or analytics/pixel
              integrations in the current website code. Your browser, hosting provider, or third-party
              services may still process technical data as part of delivering the website.
            </p>
          </section>

          <section id="services">
            <h2>Third-party services</h2>
            <p>
              The website uses NewsData.io for news, RSS2JSON to convert the Google News feed, and a
              RapidAPI-hosted trends service for popular topics. When your browser requests those features,
              the relevant provider may receive technical request data and, for search, the search query.
              Their own privacy policies and terms govern their handling of that information.
            </p>
            <p>
              News articles link to their publishers. Opening an external link takes you to a site with its
              own privacy practices; please review that site’s policy.
            </p>
          </section>

          <section id="choices">
            <h2>Your choices</h2>
            <p>
              You can choose what to search for and whether to open external stories. You do not need to
              submit personal details to browse the news. If you contact us, include only the information
              needed to respond.
            </p>
          </section>

          <section id="security">
            <h2>Security and links</h2>
            <p>
              We take care to keep the website and its dependencies maintained, but no website or internet
              transmission can be guaranteed completely secure. Links to third-party services and publishers
              are provided for convenience and are outside this policy.
            </p>
          </section>

          <section id="changes">
            <h2>Policy updates and questions</h2>
            <p>
              This policy may be updated when the website or its data practices change. The date at the top
              shows when it was last revised. For a privacy question, please{' '}
              <Link to="/contact-us">contact us</Link>.
            </p>
            <p>
              This page is a general description of the current website, not legal advice. If you have a
              question about a provider’s data practices, please refer to that provider’s privacy policy.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}

export default PrivacyPolicy;
