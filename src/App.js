import './App.css';
import React, {Suspense, useState} from 'react';
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useLocation,
  useOutletContext,
  useRouteError,
  useSearchParams,
} from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const NavBar = React.lazy(() => import('./Components/NavBar'));
const ContactUs = React.lazy(() => import('./Components/ContactUs'));
const AboutUs = React.lazy(() => import('./Components/AboutUs'));
const NewsDetail = React.lazy(() => import('./Components/NewsDetail'));
const PrivacyPolicy = React.lazy(() => import('./Components/PrivacyPolicy'));
const NewsLiteracy = React.lazy(() => import('./Components/NewsLiteracy'));
const News = React.lazy(() => import('./Components/News'));
const SavedStories = React.lazy(() => import('./Components/SavedStories'));

const pageMetadata = {
  '/': {
    title: 'India Speaks | News from India and beyond',
    description:
      'Explore news from India and around the world by topic. Discover stories and follow links to their original publishers.',
  },
  '/politics': {
    title: 'Politics News | India Speaks',
    description: 'Explore politics news from India and around the world.',
  },
  '/world': {
    title: 'World News | India Speaks',
    description: 'Explore international news stories from India Speaks.',
  },
  '/business': {
    title: 'Business News | India Speaks',
    description: 'Explore business news and updates from India and beyond.',
  },
  '/entertainment': {
    title: 'Entertainment News | India Speaks',
    description: 'Explore entertainment news from India and around the world.',
  },
  '/health': {
    title: 'Health News | India Speaks',
    description: 'Explore health news and updates from India and beyond.',
  },
  '/science': {
    title: 'Science News | India Speaks',
    description: 'Explore science news and discoveries from around the world.',
  },
  '/sports': {
    title: 'Sports News | India Speaks',
    description: 'Explore sports news and updates from India and around the world.',
  },
  '/technology': {
    title: 'Technology News | India Speaks',
    description: 'Explore technology news from India and around the world.',
  },
  '/food': {
    title: 'Food News | India Speaks',
    description: 'Explore food news, stories, and updates from India and beyond.',
  },
  '/environment': {
    title: 'Environment News | India Speaks',
    description: 'Explore environment news from India and around the world.',
  },
  '/search': {title: 'Search News | India Speaks', description: 'Search news topics and stories with India Speaks.'},
  '/about-us': {
    title: 'About India Speaks',
    description: 'Learn about India Speaks, a news discovery website for stories from India and beyond.',
  },
  '/contact-us': {
    title: 'Contact India Speaks',
    description: 'Contact India Speaks with a question, feedback, or suggestion.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | India Speaks',
    description:
      'Read the India Speaks privacy policy and learn how the website and its third-party services use information.',
  },
  '/news-literacy': {
    title: 'How to Evaluate a News Story | India Speaks',
    description:
      'A practical guide to checking a news story’s original source, evidence, context, and supporting reports.',
  },
  '/newsDetails': {
    title: 'News Story | India Speaks',
    description: 'View a news story and follow the link to its original publisher.',
  },
  '/story': {
    title: 'News Story | India Speaks',
    description: 'View a story preview and follow the link to its original publisher.',
  },
  '/saved': {
    title: 'Saved Stories | India Speaks',
    description: 'Return to stories you saved on this device.',
  },
};

function RouteMetadata() {
  const {pathname} = useLocation();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const metadata = pageMetadata[pathname];
    const isStory = pathname === '/story' || pathname === '/newsDetails';
    const title = isStory && searchParams.get('title')
      ? `${searchParams.get('title')} | India Speaks`
      : metadata
        ? metadata.title
        : 'Page not found | India Speaks';
    const description = isStory && searchParams.get('description')
      ? searchParams.get('description').slice(0, 250)
      : metadata
        ? metadata.description
        : 'The requested India Speaks page could not be found.';
    document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.name = 'description';
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.content = description;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = description;
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = `https://indiaspeaks.netlify.app${pathname}`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://indiaspeaks.netlify.app${pathname}`;

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content =
      pathname === '/search' || pathname === '/newsDetails' || pathname === '/story' || pathname === '/saved'
        ? 'noindex,follow'
        : metadata
          ? 'index,follow'
          : 'noindex,follow';
  }, [pathname, searchParams]);

  return null;
}

function AppLayout() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        waitingTime={400}
        loaderSpeed={500}
        transitionTime={300}
      />
      <ScrollRestoration />
      <RouteMetadata />
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <div id="main-content" tabIndex="-1">
          <Outlet context={setProgress} />
        </div>
      </Suspense>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__brand">India Speaks</p>
          <p className="site-footer__description">
            News discovery from India and beyond. Stories remain the work of their original publishers.
          </p>
          <nav className="site-footer__links" aria-label="Information and policies">
            <Link to="/about-us">About</Link>
            <Link to="/news-literacy">Reader’s guide</Link>
            <Link to="/contact-us">Contact</Link>
            <Link to="/privacy-policy">Privacy policy</Link>
          </nav>
          <p className="site-footer__copyright">© {new Date().getFullYear()} India Speaks</p>
        </div>
      </footer>
    </div>
  );
}

function NewsRoute({category}) {
  const setProgress = useOutletContext();

  return <News key={category} category={category} setProgress={setProgress} />;
}

function NotFound() {
  return (
    <main className="story-detail">
      <p className="news-page__eyebrow">404 · PAGE NOT FOUND</p>
      <h1>We couldn’t find that page.</h1>
      <p>The link may be outdated, or the address may be incorrect.</p>
      <Link className="info-button" to="/">
        Return to headlines <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}

function RouteError() {
  const error = useRouteError();
  React.useEffect(() => {
    console.error('A page failed to load:', error);
  }, [error]);
  return (
    <main className="story-detail" role="alert">
      <p className="news-page__eyebrow">SOMETHING WENT WRONG</p>
      <h1>This page could not be loaded.</h1>
      <p>Please try again or return to the latest headlines.</p>
      <Link className="info-button" to="/">
        Return to headlines <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      {path: '/', element: <NewsRoute category="top" />},
      {path: '/politics', element: <NewsRoute category="politics" />},
      {path: '/world', element: <NewsRoute category="world" />},
      {path: '/business', element: <NewsRoute category="business" />},
      {path: '/entertainment', element: <NewsRoute category="entertainment" />},
      {path: '/health', element: <NewsRoute category="health" />},
      {path: '/science', element: <NewsRoute category="science" />},
      {path: '/sports', element: <NewsRoute category="sports" />},
      {path: '/technology', element: <NewsRoute category="technology" />},
      {path: '/food', element: <NewsRoute category="food" />},
      {path: '/environment', element: <NewsRoute category="environment" />},
      {path: '/search', element: <NewsRoute category="search" />},
      {path: '/saved', element: <SavedStories />},
      {path: '/story', element: <NewsDetail />},
      {path: '/newsDetails', element: <NewsDetail />},
      {path: '/privacy-policy', element: <PrivacyPolicy />},
      {path: '/news-literacy', element: <NewsLiteracy />},
      {path: '/contact-us', element: <ContactUs />},
      {path: '/about-us', element: <AboutUs />},
      {path: '*', element: <NotFound />},
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
