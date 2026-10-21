import React, {useState} from 'react';
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {getSafeHttpUrl, storyFromSearchParams} from './Utilities/Stories';

function NewsDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const legacyStory = location.state?.props;
  const story = legacyStory
    ? {
        title: legacyStory.title || '',
        description: legacyStory.description || '',
        imageUrl: getSafeHttpUrl(legacyStory.imageUrl),
        newsUrl: getSafeHttpUrl(legacyStory.newsUrl),
        author: legacyStory.author || '',
        date: legacyStory.date || '',
        source: legacyStory.source || '',
      }
    : storyFromSearchParams(searchParams);
  const [shareMessage, setShareMessage] = useState('');
  const publishedAt = new Date(story.date);
  const hasPublishedAt = !Number.isNaN(publishedAt.getTime());

  const shareStory = async () => {
    try {
      if (navigator.share) {
        await navigator.share({title: story.title, url: window.location.href});
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage('Story link copied.');
      } else {
        setShareMessage('Sharing is not available in this browser.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Could not share story:', error);
        setShareMessage('The story link could not be shared.');
      }
    }
  };

  if (!story.title || !story.newsUrl) {
    return (
      <main className="story-detail">
        <p className="news-page__eyebrow">STORY UNAVAILABLE</p>
        <h1>This story details link is incomplete.</h1>
        <p>Return to the news feed and open the story from its card.</p>
        <Link className="info-button" to="/">
          Browse headlines <span aria-hidden="true">→</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="story-detail">
      <p className="news-page__eyebrow">{story.source || 'INDIA SPEAKS · NEWS DISCOVERY'}</p>
      <h1>{story.title}</h1>
      <p className="story-detail__meta">
        {story.author ? `By ${story.author}` : 'India Speaks'}
        {hasPublishedAt && (
          <>
            {' · '}
            <time dateTime={publishedAt.toISOString()}>
              {publishedAt.toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </time>
          </>
        )}
      </p>
      {story.imageUrl && <img className="story-detail__image" src={story.imageUrl} alt="" />}
      {story.description && <p className="story-detail__description">{story.description}</p>}
      <p className="story-detail__notice">
        This is a story preview. The full article is published by its original source.
      </p>
      <div className="story-detail__actions">
        <button className="info-button info-button--secondary" type="button" onClick={() => navigate(-1)}>
          Back to stories
        </button>
        <button className="info-button" type="button" onClick={shareStory}>
          Share story <span aria-hidden="true">↗</span>
        </button>
        <a className="info-button" href={story.newsUrl} target="_blank" rel="noopener noreferrer">
          Read original article <span aria-hidden="true">↗</span>
        </a>
      </div>
      {shareMessage && (
        <p className="story-detail__status" role="status">
          {shareMessage}
        </p>
      )}
    </main>
  );
}

export default NewsDetail;
