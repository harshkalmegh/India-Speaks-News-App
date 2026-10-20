import React from 'react';

function Spinner() {
  return (
    <div className="news-feed__loading" role="status" aria-label="Loading more stories">
      <span className="news-feed__loading-spinner" aria-hidden="true" />
      <span className="visually-hidden">Loading more stories</span>
    </div>
  );
}

export default Spinner;
