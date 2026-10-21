import React, {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import {readPreferredTopics, writePreferredTopics} from './Utilities/TopicPreferences';

const sections = [
  ['Home', '/'],
  ['Politics', '/politics'],
  ['World', '/world'],
  ['Business', '/business'],
  ['Entertainment', '/entertainment'],
  ['Health', '/health'],
  ['Science', '/science'],
  ['Sports', '/sports'],
  ['Technology', '/technology'],
  ['Food', '/food'],
  ['Environment', '/environment'],
  ['Search', '/search'],
  ['Saved', '/saved'],
  ['Reader’s guide', '/news-literacy'],
  ['Privacy', '/privacy-policy'],
  ['Contact', '/contact-us'],
  ['About', '/about-us'],
];

const newsCategoryPaths = new Set([
  '/politics',
  '/world',
  '/business',
  '/entertainment',
  '/health',
  '/science',
  '/sports',
  '/technology',
  '/food',
  '/environment',
]);
const topicSections = sections.filter(([, to]) => newsCategoryPaths.has(to));
const allowedTopics = new Set(topicSections.map(([, to]) => to));

function NavBar() {
  const [preferredTopics, setPreferredTopics] = useState(() => readPreferredTopics(allowedTopics));
  const [preferenceError, setPreferenceError] = useState(false);

  useEffect(() => {
    const updatePreferences = () => setPreferredTopics(readPreferredTopics(allowedTopics));
    window.addEventListener('india-speaks:preferred-topics-change', updatePreferences);
    window.addEventListener('storage', updatePreferences);
    return () => {
      window.removeEventListener('india-speaks:preferred-topics-change', updatePreferences);
      window.removeEventListener('storage', updatePreferences);
    };
  }, []);

  const togglePreferredTopic = topic => {
    const updatedTopics = preferredTopics.includes(topic)
      ? preferredTopics.filter(item => item !== topic)
      : [...preferredTopics, topic];
    try {
      writePreferredTopics(updatedTopics);
      setPreferredTopics(updatedTopics);
      setPreferenceError(false);
    } catch (error) {
      console.error('Could not save preferred topics:', error);
      setPreferenceError(true);
    }
  };

  return (
    <header className="news-navbar">
      <div className="news-navbar__top">
        <NavLink className="news-navbar__brand" to="/" end viewTransition>
          <span className="news-navbar__mark" aria-hidden="true">
            IS
          </span>
          <span>
            India Speaks
            <small>News from India and beyond</small>
          </span>
        </NavLink>
        <span className="news-navbar__edition">YOUR DAILY BRIEFING</span>
      </div>
      <nav className="news-navbar__nav" aria-label="News sections">
        <ul className="news-navbar__links">
          {sections.map(([label, to]) => (
            <li key={to}>
              <NavLink
                className={({isActive}) =>
                  `news-navbar__link${isActive ? ' is-active' : ''}`
                }
                to={to}
                end={to === '/'}
                viewTransition
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="news-navbar__preferences">
        {preferredTopics.length > 0 && (
          <nav className="news-navbar__preferred" aria-label="Your preferred topics">
            <span>Your topics</span>
            {topicSections
              .filter(([, to]) => preferredTopics.includes(to))
              .map(([label, to]) => (
                <NavLink key={to} to={to} className="news-navbar__preferred-link">
                  {label}
                </NavLink>
              ))}
          </nav>
        )}
        <details className="news-navbar__topic-settings">
          <summary>Customize topic shortcuts</summary>
          <fieldset>
            <legend>Choose the topics shown in your shortcuts</legend>
            <div>
              {topicSections.map(([label, to]) => (
                <label key={to}>
                  <input
                    type="checkbox"
                    checked={preferredTopics.includes(to)}
                    onChange={() => togglePreferredTopic(to)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </details>
        {preferenceError && (
          <p className="news-navbar__preference-error" role="alert">
            Topic shortcuts could not be saved on this device.
          </p>
        )}
      </div>
    </header>
  );
}

export default NavBar;
