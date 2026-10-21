import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import NewsItem from './NewsItem';
import {readSavedStories} from './Utilities/Stories';

function SavedStories() {
  const [stories, setStories] = useState(readSavedStories);

  useEffect(() => {
    const refreshStories = () => setStories(readSavedStories());
    window.addEventListener('india-speaks:saved-stories-change', refreshStories);
    window.addEventListener('storage', refreshStories);
    return () => {
      window.removeEventListener('india-speaks:saved-stories-change', refreshStories);
      window.removeEventListener('storage', refreshStories);
    };
  }, []);

  return (
    <main className="news-page">
      <header className="news-page__heading">
        <p className="news-page__eyebrow">YOUR READING LIST</p>
        <h1>Saved stories</h1>
        <p className="news-page__intro">Saved on this device for your next visit.</p>
      </header>
      {stories.length ? (
        <div className="news-feed">
          <div className="news-feed__grid">
            {stories.map(story => (
              <div className="news-feed__item" key={story.newsUrl}>
                <NewsItem {...story} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <section className="saved-stories-empty">
          <h2>No saved stories yet</h2>
          <p>Use “Save story” on an article to keep it here on this device.</p>
          <Link className="info-button" to="/">
            Browse the latest stories <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}
    </main>
  );
}

export default SavedStories;
