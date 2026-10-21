import React, {useEffect, useState, Suspense} from 'react';
import PropTypes from 'prop-types';
import {useSearchParams} from 'react-router-dom';
import {GetRequest} from './Utilities/Network/Index';
import {getSafeHttpUrl} from './Utilities/Stories';
import InfiniteScroll from 'react-infinite-scroll-component';

const NewsItem = React.lazy(() => import('./NewsItem'));
const Spinner = React.lazy(() => import('./Spinner'));

const popularSearches = ['indore', 'madhya pradesh', 'amravati', 'maharashtra', 'आरएसएस'];
const capitalizeFirstLetter = value => value.charAt(0).toUpperCase() + value.slice(1);

function News({category = 'general', setProgress}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q')?.trim() || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const [feedRequest, setFeedRequest] = useState(0);
  const [page, setPage] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [input, setInput] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [nextPage, setNextPage] = useState('');
  const [headlines, setHeadlines] = useState([]);
  const [headlinesLoading, setHeadlinesLoading] = useState(true);
  const [headlinesError, setHeadlinesError] = useState(false);
  const [headlinesRequest, setHeadlinesRequest] = useState(0);
  const [language, setLanguage] = useState('hi');
  const [articleLanguage, setArticleLanguage] = useState('en,hi');

  useEffect(() => {
    const controller = new AbortController();
    const updateNews = async () => {
      if (category === 'search' && !submittedQuery) {
        setLoading(false);
        setFeedError(false);
        setArticles([]);
        setTotalResults(0);
        setNextPage('');
        return;
      }

      const parameters = new URLSearchParams();
      parameters.set('language', articleLanguage);
      if (category === 'search') parameters.set('q', submittedQuery);
      else parameters.set('category', category);
      if (page) parameters.set('page', page);

      setLoading(true);
      setFeedError(false);
      try {
        const data = await GetRequest(
          `/.netlify/functions/news?${parameters.toString()}`,
          controller.signal,
        );

        if (controller.signal.aborted) return;
        if (!data || data.status !== 'ok' || !Array.isArray(data.results)) {
          throw new Error('The news service returned an invalid response.');
        }

        setArticles(currentArticles => {
          const existingIds = new Set(
            currentArticles.map(article => article.article_id || article.link).filter(Boolean),
          );
          const newArticles = data.results.filter(article => {
            const id = article.article_id || article.link;
            if (!id || existingIds.has(id)) return false;
            existingIds.add(id);
            return true;
          });
          return page ? [...currentArticles, ...newArticles] : newArticles;
        });
        setTotalResults(Number(data.totalResults) || 0);
        setNextPage(typeof data.nextPage === 'string' ? data.nextPage : '');
        if (category !== 'search') setProgress?.(100);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load news stories:', error);
          setFeedError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    updateNews();
    return () => controller.abort();
  }, [page, category, submittedQuery, feedRequest, setProgress, articleLanguage]);

  const fetchMoreData = () => {
    if (!loading && nextPage && articles.length < totalResults) setPage(nextPage);
  };

  const startSearch = query => {
    const searchQuery = (query ?? input).trim();
    if (!searchQuery) return;

    setInput(searchQuery);
    setArticles([]);
    setPage('');
    setNextPage('');
    setTotalResults(0);
    setSubmittedQuery(searchQuery);
    setSearchParams({q: searchQuery});
    setFeedRequest(request => request + 1);
  };

  const clearSearch = () => {
    setArticles([]);
    setPage('');
    setNextPage('');
    setTotalResults(0);
    setInput('');
    setSubmittedQuery('');
    setSearchParams({});
    setFeedRequest(request => request + 1);
  };

  useEffect(() => {
    if (category !== 'top' && category !== 'search') return undefined;

    const controller = new AbortController();
    const fetchHeadlines = async () => {
      setHeadlinesLoading(true);
      setHeadlinesError(false);
      try {
        const response = await fetch(
          `/.netlify/functions/google-news?language=${encodeURIComponent(language)}`,
          {signal: controller.signal},
        );
        const data = await response.json();
        if (!response.ok || data.status !== 'ok' || !Array.isArray(data.items)) {
          throw new Error(data.message || `Headlines request failed with status ${response.status}.`);
        }
        if (controller.signal.aborted) return;

        const items = data.items.slice(0, 10).map((item, index) => ({
          id: item.guid || item.link || `headline-${index}`,
          title: item.title || '',
          url: getSafeHttpUrl(item.link),
          publishedAt: item.pubDate || '',
        }));
        setHeadlines(items.filter(item => item.title && item.url));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load Google News headlines:', error);
          setHeadlinesError(true);
        }
      } finally {
        if (!controller.signal.aborted) setHeadlinesLoading(false);
      }
    };

    fetchHeadlines();
    return () => controller.abort();
  }, [category, language, headlinesRequest]);

  const hasMore = Boolean(nextPage) && articles.length < totalResults;

  return (
    <Suspense fallback={<div className="news-page__loading" role="status">Loading news…</div>}>
      <main className="news-page">
        <header className="news-page__heading">
          <p className="news-page__eyebrow">THE LATEST FROM INDIA</p>
          <h1>{category === 'top' ? 'Top headlines' : `${capitalizeFirstLetter(category)} news`}</h1>
          <p className="news-page__intro">
            {category === 'search'
              ? 'Find the stories and topics you care about.'
              : 'The stories shaping India, selected for you.'}
          </p>
          {category !== 'search' && (
            <p className="news-page__cache-note" role="note">
              Feeds may use temporarily cached stories when you’re offline; check publication dates for freshness.
            </p>
          )}
          <div className="news-language-controls">
            <label className="news-language">
              Stories language
              <select
                value={articleLanguage}
                onChange={event => {
                  setArticles([]);
                  setPage('');
                  setNextPage('');
                  setTotalResults(0);
                  setArticleLanguage(event.target.value);
                }}
              >
                <option value="en,hi">English and Hindi</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </label>
            {(category === 'top' || category === 'search') && (
              <label className="news-language">
                Headlines language
                <select value={language} onChange={event => setLanguage(event.target.value)}>
                  <option value="hi">Hindi</option>
                  <option value="en">English</option>
                </select>
              </label>
            )}
          </div>
        </header>

        {category === 'search' && (
          <div className="news-page__content">
            <form
              className="news-search"
              onSubmit={event => {
                event.preventDefault();
                startSearch();
              }}
            >
              <input
                type="search"
                className="SearchNews"
                placeholder="Search news and topics"
                aria-label="Search news"
                value={input}
                maxLength={250}
                onChange={event => setInput(event.target.value)}
                enterKeyHint="search"
              />
              <div className="SearchNewsIcon">
                <button className="SearchNewsButton news-search__submit" type="submit">
                  Search
                </button>
                <button className="SearchNewsButton news-search__reset" type="button" onClick={clearSearch}>
                  Clear
                </button>
              </div>
            </form>
            {!submittedQuery && (
              <section className="newsSearches" aria-labelledby="popular-topics">
                <h2 id="popular-topics" className="news-page__section-title">
                  Explore popular topics
                </h2>
                <div className="news-search__suggestions">
                  {popularSearches.map(item => (
                    <button
                      key={item}
                      className="news-search__chip"
                      type="button"
                      onClick={() => startSearch(item)}
                    >
                      {item}
                    </button>
                  ))}
                  {headlines.map(item => (
                    <button
                      key={item.id}
                      className="news-search__chip"
                      type="button"
                      onClick={() => startSearch(item.title)}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {(category === 'top' || (category === 'search' && !submittedQuery)) && (
          <section className="containerTopHead" aria-labelledby="trending-headlines">
            <div className="news-cardTopHead">
              <div className="news-cardTopHead__heading">
                <span className="news-cardTopHead__icon" aria-hidden="true">↗</span>
                <div>
                  <p className="news-page__eyebrow">GOOGLE NEWS INDIA · {language.toUpperCase()}</p>
                  <h2 id="trending-headlines" className="titleTopHead">Top 10 headlines</h2>
                </div>
              </div>
              {headlinesLoading ? (
                <p className="loadingTopHead" role="status">Finding the latest stories…</p>
              ) : headlinesError ? (
                <div role="alert">
                  <p className="loadingTopHead">Google News headlines could not be loaded right now.</p>
                  <button
                    className="SearchNewsButton"
                    type="button"
                    onClick={() => setHeadlinesRequest(request => request + 1)}
                  >
                    Try again
                  </button>
                </div>
              ) : headlines.length ? (
                <ul className="news-listTopHead">
                  {headlines.map((article, index) => {
                    const publishedAt = new Date(article.publishedAt);
                    return (
                      <li key={article.id} className="news-itemTopHead">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" lang={language}>
                          {index + 1}. {article.title}
                        </a>
                        {!Number.isNaN(publishedAt.getTime()) && (
                          <p className="timestampTopHead">
                            <time dateTime={publishedAt.toISOString()}>
                              {publishedAt.toLocaleString('en-IN')}
                            </time>
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="loadingTopHead" role="status">No headlines are available right now.</p>
              )}
            </div>
          </section>
        )}

        {(articles.length > 0 || loading || (category === 'search' && submittedQuery)) && (
          <div className="news-feed__heading">
            <h2>{category === 'search' ? 'Search results' : 'Latest stories'}</h2>
            {articles.length > 0 && (
              <span>{articles.length} {articles.length === 1 ? 'story' : 'stories'}</span>
            )}
          </div>
        )}

        {category === 'search' && submittedQuery && !loading && !feedError && articles.length === 0 && (
          <div className="news-search__empty" role="status">
            <h2>No stories found</h2>
            <p>Try a different search phrase or check the spelling.</p>
          </div>
        )}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={loading ? <Spinner /> : null}
          endMessage={
            articles.length > 0 && !loading && (
              <p className="text-center my-4" role="status">You’re all caught up.</p>
            )
          }
        >
          {feedError && (
            <div className="news-feed__error" role="alert">
              <p>Latest stories could not be loaded. Please check your connection and try again.</p>
              <button
                className="SearchNewsButton news-search__submit"
                type="button"
                onClick={() => setFeedRequest(request => request + 1)}
              >
                Try again
              </button>
            </div>
          )}
          <div className="news-feed">
            <div className="news-feed__grid">
              {articles.map((article, index) => (
                <div
                  className="news-feed__item"
                  key={article.article_id || article.link || `${article.title}-${index}`}
                >
                  <NewsItem
                    title={article.title || ''}
                    description={article.description || ''}
                    imageUrl={article.image_url}
                    newsUrl={article.link}
                    author={Array.isArray(article.creator) ? article.creator.join(', ') : article.creator}
                    date={article.pubDate}
                    source={article.source_id}
                  />
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>

        {hasMore && (
          <div className="news-feed__load-more">
            <button
              className="SearchNewsButton news-search__submit"
              type="button"
              onClick={fetchMoreData}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Load more stories'}
            </button>
          </div>
        )}
      </main>
    </Suspense>
  );
}

News.propTypes = {
  category: PropTypes.string,
  setProgress: PropTypes.func.isRequired,
};

export default News;
