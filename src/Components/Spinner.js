import React, {Suspense} from 'react';

const loading = React.lazy(() => import('./loading.gif'));

function Spinner() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="text-center">
        <img src={loading} alt="loading" />
      </div>
    </Suspense>
  );
}

export default Spinner;
