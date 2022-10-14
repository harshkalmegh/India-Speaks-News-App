import React, {Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const App = React.lazy(() => import('./App'));

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
);

serviceWorkerRegistration.register();

reportWebVitals();
