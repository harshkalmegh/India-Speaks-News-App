import React, {useState} from 'react';

const CONTACT_EMAIL = 'harshkalmegh3@gmail.com';

function ContactUs() {
  const [notice, setNotice] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name').toString().trim();
    const email = formData.get('email').toString().trim();
    const message = formData.get('message').toString().trim();
    const subject = `India Speaks message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setNotice('Your email app should open with your message ready to send.');
  };

  return (
    <main className="info-page contact-page">
      <header className="info-hero">
        <p className="info-eyebrow">CONTACT</p>
        <h1>We’re listening.</h1>
        <p className="info-hero__intro">
          Send a question, share feedback, or let us know how we can improve India Speaks.
        </p>
      </header>

      <div className="contact-layout">
        <aside className="contact-aside">
          <section className="info-card contact-aside__card">
            <span className="info-card__icon" aria-hidden="true">
              @
            </span>
            <p className="info-eyebrow">EMAIL US</p>
            <h2>Prefer your email app?</h2>
            <p>Reach out directly and include any details that will help us understand your request.</p>
            <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </section>
          <p className="contact-note">
            Please avoid including passwords, payment details, or other sensitive information in your
            message.
          </p>
        </aside>

        <section className="info-card contact-form-card">
          <div className="contact-form-card__heading">
            <p className="info-eyebrow">SEND A MESSAGE</p>
            <h2>How can we help?</h2>
            <p>This form prepares an email in your device’s email app. It does not send anything automatically.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Your name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Priya Sharma"
              required
              maxLength={100}
            />

            <label htmlFor="contact-email">Email address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
            />

            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Tell us what’s on your mind…"
              rows="6"
              required
              maxLength={5000}
            />

            <button className="info-button" type="submit">
              Prepare email <span aria-hidden="true">→</span>
            </button>
            {notice && (
              <p className="contact-notice" role="status">
                {notice}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}

export default ContactUs;
