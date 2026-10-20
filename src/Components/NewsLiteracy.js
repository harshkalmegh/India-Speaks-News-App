import React from 'react';
import {Link} from 'react-router-dom';

const readingChecks = [
  {
    title: 'Find the original source',
    body:
      'Open the publisher’s article rather than relying on a headline or a short preview. Look for links to documents, statements, datasets, research, or direct interviews that support the main claims.',
  },
  {
    title: 'Separate evidence from interpretation',
    body:
      'Notice which details are verifiable facts, which are attributed claims, and which are analysis or opinion. A confident headline is not evidence by itself.',
  },
  {
    title: 'Compare independent reporting',
    body:
      'Check whether other established publishers report the same key facts. Look for genuinely independent sources, not several sites repeating the same original report.',
  },
  {
    title: 'Check date, place, and context',
    body:
      'Confirm when and where the event happened. Older stories, archive photos, and partial quotations can circulate as if they describe something new.',
  },
  {
    title: 'Treat images and translations carefully',
    body:
      'Images can be cropped, edited, or reused from another event. When a story is translated, compare important names, figures, and quotations with the original wording where possible.',
  },
];

function NewsLiteracy() {
  return (
    <main className="info-page news-literacy">
      <header className="info-hero">
        <p className="info-eyebrow">A READER’S GUIDE</p>
        <h1>How to evaluate a news story</h1>
        <p className="info-hero__intro">
          A practical checklist for checking context, evidence, and sources before sharing a story.
        </p>
      </header>

      <article className="info-card literacy-article">
        <p className="privacy-summary">
          A headline or search result is only a starting point. Read the publisher’s full report, check
          what supports its claims, and keep uncertainty in mind when details are still developing.
        </p>

        {readingChecks.map((check, index) => (
          <section className="literacy-check" key={check.title}>
            <span className="literacy-check__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h2>{check.title}</h2>
              <p>{check.body}</p>
            </div>
          </section>
        ))}

        <section className="literacy-note">
          <h2>Keep the limits in view</h2>
          <p>
            Breaking stories can change as more information becomes available. Multiple reports do not
            automatically make a claim true, and an absent source is not proof that a claim is false. When
            something matters, consult primary material and qualified sources, and wait for reliable
            confirmation.
          </p>
          <p>
            India Speaks helps readers discover stories from external publishers. It does not independently
            verify every item in its feeds; use the original publisher and the checks above to assess a
            report.
          </p>
        </section>

        <p className="literacy-contact">
          Have feedback about the guide? <Link to="/contact-us">Contact India Speaks</Link>.
        </p>
      </article>
    </main>
  );
}

export default NewsLiteracy;
