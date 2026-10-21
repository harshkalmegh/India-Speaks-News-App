import React from 'react';
import {Link} from 'react-router-dom';
import {createStoryPath, getSafeHttpUrl, readSavedStories, writeSavedStories} from './Utilities/Stories';

function NewsItem({title, description, imageUrl, newsUrl, author, date, source}) {
  const publishedAt = new Date(date);
  const hasPublishedAt = !Number.isNaN(publishedAt.getTime());
  const titleLanguage = /[\u0900-\u097F]/.test(title) ? 'hi' : 'en';
  const descriptionLanguage = /[\u0900-\u097F]/.test(description || '') ? 'hi' : 'en';
  const safeNewsUrl = getSafeHttpUrl(newsUrl);
  const safeImageUrl = getSafeHttpUrl(imageUrl);
  const story = {title, description, imageUrl: safeImageUrl, newsUrl: safeNewsUrl, author, date, source};
  const [imageFailed, setImageFailed] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(() =>
    Boolean(safeNewsUrl && readSavedStories().some(savedStory => savedStory.newsUrl === safeNewsUrl)),
  );
  const [saveError, setSaveError] = React.useState(false);

  React.useEffect(() => {
    const updateSavedState = () => {
      setIsSaved(readSavedStories().some(savedStory => savedStory.newsUrl === safeNewsUrl));
    };
    window.addEventListener('india-speaks:saved-stories-change', updateSavedState);
    window.addEventListener('storage', updateSavedState);
    return () => {
      window.removeEventListener('india-speaks:saved-stories-change', updateSavedState);
      window.removeEventListener('storage', updateSavedState);
    };
  }, [safeNewsUrl]);

  const toggleSaved = () => {
    if (!safeNewsUrl) return;
    try {
      const savedStories = readSavedStories();
      const updatedStories = isSaved
        ? savedStories.filter(savedStory => savedStory.newsUrl !== safeNewsUrl)
        : [story, ...savedStories.filter(savedStory => savedStory.newsUrl !== safeNewsUrl)];
      writeSavedStories(updatedStories);
      setIsSaved(!isSaved);
      setSaveError(false);
    } catch (error) {
      console.error('Could not update saved stories:', error);
      setSaveError(true);
    }
  };

  return (
    <article className="news-card">
      {safeImageUrl && !imageFailed ? (
        <img
          src={safeImageUrl}
          className="news-card__image"
          alt={title ? `Image for ${title}` : 'News article'}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="news-card__image-placeholder" aria-hidden="true">
          <span>INDIA SPEAKS</span>
        </div>
      )}
      <div className="news-card__body">
        {source && <span className="news-card__source">{source}</span>}
        <h2 className="news-card__title" lang={titleLanguage}>
          {title}
        </h2>
        {description && (
          <p className="news-card__description" lang={descriptionLanguage}>
            {description}
          </p>
        )}
        <div className="news-card__footer">
          <p className="news-card__meta">
            {author ? `By ${author}` : 'India Speaks'}
            {hasPublishedAt && (
              <>
                {' · '}
                <time dateTime={publishedAt.toISOString()}>
                  {publishedAt.toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
              </>
            )}
          </p>
          {safeNewsUrl && (
            <a
              className="news-card__read-more"
              href={safeNewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read full story: ${title}`}
            >
              Read story <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        <div className="news-card__actions">
          {safeNewsUrl && (
            <>
              <Link className="news-card__details" to={createStoryPath(story)}>
                Story details
              </Link>
              <button
                className="news-card__save"
                type="button"
                onClick={toggleSaved}
                aria-pressed={isSaved}
              >
                {isSaved ? 'Saved' : 'Save story'}
              </button>
            </>
          )}
        </div>
        {saveError && (
          <p className="news-card__save-error" role="alert">
            This story could not be saved on this device.
          </p>
        )}
      </div>
    </article>
  );
}

export default NewsItem;
