import './App.css';
import React, {Suspense, useState} from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useOutletContext,
} from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const NavBar = React.lazy(() => import('./Components/NavBar'));
const ContactUs = React.lazy(() => import('./Components/ContactUs'));
const AboutUs = React.lazy(() => import('./Components/AboutUs'));
const NewsDetail = React.lazy(() => import('./Components/NewsDetail'));
const PrivacyPolicy = React.lazy(() => import('./Components/PrivacyPolicy'));
const News = React.lazy(() => import('./Components/News'));

function AppLayout() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        waitingTime={400}
        loaderSpeed={500}
        transitionTime={300}
      />
      <ScrollRestoration />
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <Outlet context={setProgress} />
      </Suspense>
    </div>
  );
}

function NewsRoute({category}) {
  const setProgress = useOutletContext();

  return <News key={category} category={category} setProgress={setProgress} />;
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
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
      {path: '/newsDetails', element: <NewsDetail />},
      {path: '/privacy-policy', element: <PrivacyPolicy />},
      {path: '/contact-us', element: <ContactUs />},
      {path: '/about-us', element: <AboutUs />},
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
