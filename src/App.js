import './App.css';
import React, {Suspense} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import {useState} from 'react';

const NavBar = React.lazy(() => import('./Components/NavBar'));
const News = React.lazy(() => import('./Components/News'));

function App() {
  const [progress, setProgress] = useState(0);
  let apiKey = '9144bd5aec61439fa30794031bd04725';
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <NavBar />
          <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <News
                  setProgress={setProgress}
                  key=""
                  pageSize={6}
                  country="in"
                  category="top"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/politics"
              element={
                <News
                  setProgress={setProgress}
                  key="politics"
                  pageSize={6}
                  country="in"
                  category="politics"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/world"
              element={
                <News
                  setProgress={setProgress}
                  key="world"
                  pageSize={6}
                  country="in"
                  category="world"
                  apiKey={apiKey}
                />
              }
            />

            <Route
              exact
              path="/business"
              element={
                <News
                  setProgress={setProgress}
                  key="business"
                  pageSize={6}
                  country="in"
                  category="business"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/entertainment"
              element={
                <News
                  setProgress={setProgress}
                  key="entertainment"
                  pageSize={6}
                  country="in"
                  category="entertainment"
                  apiKey={apiKey}
                />
              }
            />

            <Route
              exact
              path="/health"
              element={
                <News
                  setProgress={setProgress}
                  key="health"
                  pageSize={6}
                  country="in"
                  category="health"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/science"
              element={
                <News
                  setProgress={setProgress}
                  key="science"
                  pageSize={6}
                  country="in"
                  category="science"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/sports"
              element={
                <News
                  setProgress={setProgress}
                  key="sports"
                  pageSize={6}
                  country="in"
                  category="sports"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/technology"
              element={
                <News
                  setProgress={setProgress}
                  key="technology"
                  pageSize={6}
                  country="in"
                  category="technology"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/food"
              element={
                <News
                  setProgress={setProgress}
                  key="food"
                  pageSize={6}
                  country="in"
                  category="food"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/environment"
              element={
                <News
                  setProgress={setProgress}
                  key="environment"
                  pageSize={6}
                  country="in"
                  category="environment"
                  apiKey={apiKey}
                />
              }
            />
            <Route
              exact
              path="/search"
              element={
                <News
                  setProgress={setProgress}
                  key="search"
                  pageSize={6}
                  country="in"
                  category="search"
                  apiKey={apiKey}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
