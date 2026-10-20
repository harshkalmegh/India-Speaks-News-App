import React from 'react';
import {NavLink} from 'react-router-dom';

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
  ['Reader’s guide', '/news-literacy'],
  ['Privacy', '/privacy-policy'],
  ['Contact', '/contact-us'],
  ['About', '/about-us'],
];

function NavBar() {
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
    </header>
  );
}

export default NavBar;
