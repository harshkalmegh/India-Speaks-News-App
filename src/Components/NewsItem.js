import React from 'react';

function NewsItem({title, description, imageUrl, newsUrl, author, date, source}) {
  const publishedAt = new Date(date);
  const hasPublishedAt = !Number.isNaN(publishedAt.getTime());
  const titleLanguage = /[\u0900-\u097F]/.test(title) ? 'hi' : 'en';
  const descriptionLanguage = /[\u0900-\u097F]/.test(description || '') ? 'hi' : 'en';

  return (
    <article className="news-card">
      {imageUrl ? (
        <img
          src={imageUrl}
          className="news-card__image"
          alt={title ? `Image for ${title}` : 'News article'}
          loading="lazy"
          decoding="async"
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
          {newsUrl && (
            <a
              className="news-card__read-more"
              href={newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read full story: ${title}`}
            >
              Read story <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default NewsItem;
