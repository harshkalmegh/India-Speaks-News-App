import React, {useState, useEffect, Suspense} from 'react';
import PropTypes from 'prop-types';
import {GetRequest} from './Utilities/Network/Index';
import InfiniteScroll from 'react-infinite-scroll-component';

const NewsItem = React.lazy(() => import('./NewsItem'));
const Spinner = React.lazy(() => import('./Spinner'));

const API_KEYS = [
  'pub_69185e9b582562890079695628ea412ef69c',
  'pub_69196c0a7d5b2498f5716de4a37b63790a42',
];

const BASE_URL = 'https://newsdata.io/api/1/news';
const COMMON_PARAMS = 'country=in&language=en,hi';
const capitalizeFirstLetter = value => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Tries each API key in order until one returns a valid response.
 * @param {string} queryParams - Query string appended after the common params (e.g. "&category=sports&page=abc")
 * @param {AbortSignal} [signal] - Cancels the pending request when the feed changes.
 * @returns {Promise<object|undefined>} The first successful response, or undefined if all keys fail.
 */
const tryApiKeys = async (queryParams, signal) => {
  for (const key of API_KEYS) {
    if (signal?.aborted) return undefined;
    const url = `${BASE_URL}?apikey=${key}&${COMMON_PARAMS}${queryParams}`;
    const result = await GetRequest(url, signal, 9000);
    if (result !== undefined) return result;
  }
  return undefined;
};

function News({category = 'general', setProgress}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const [feedRequest, setFeedRequest] = useState(0);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState(false);
  const [nextPage, setNextPage] = useState('');
  const [headlines, setHeadlines] = useState([]);
  const [headlinesLoading, setHeadlinesLoading] = useState(true);
  const [headlinesError, setHeadlinesError] = useState(false);
  const [headlinesRequest, setHeadlinesRequest] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [trendsKeywords, setTrendsKeywords] = useState([]);

  const newsSearches = [
    'indore',
    'madhya pradesh',
    'amravati',
    'maharashtra',
    'आरएसएस'
  ];

  useEffect(() => {
    if (input === '') {
      setArticles([]);
      setSearch(false);
    }
  }, [input]);

  useEffect(() => {
    const controller = new AbortController();

    const updateNews = async () => {
      const pageParam = nextPage ? `&page=${nextPage}` : '';

      if (category === 'search' && input === '') {
        setLoading(false);
        setArticles([]);
        return;
      }

      const queryParams =
        category === 'search'
          ? `&q=${encodeURIComponent(input)}${pageParam}`
          : `&category=${category}${pageParam}`;

      setLoading(true);
      setFeedError(false);
      try {
        const data = await tryApiKeys(queryParams, controller.signal);

        if (data !== undefined && Array.isArray(data.results) && !controller.signal.aborted) {
          setArticles(currentArticles => [...currentArticles, ...data.results]);
          setTotalResults(data.totalResults || 0);
          setNextPage(data.nextPage || '');

          if (category !== 'search') {
            setProgress(100);
          }
        } else if (!controller.signal.aborted) {
          setFeedError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    updateNews();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, search, feedRequest]);

  const fetchMoreData = () => setPage(currentPage => currentPage + 1);

  const startSearch = query => {
    const searchQuery = (query ?? input).trim();
    if (!searchQuery) return;

    setInput(searchQuery);
    setArticles([]);
    setPage(0);
    setTotalResults(0);
    setNextPage('');
    setSearch(currentSearch => !currentSearch);
  };

  useEffect(() => {
    if (category !== 'top' && category !== 'search') return;

    const controller = new AbortController();

    const fetchTrendingNews = async () => {
      setHeadlinesLoading(true);
      setHeadlinesError(false);
      try {
        const response = await fetch('/.netlify/functions/google-news?language=hi', {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || data.status !== 'ok' || !Array.isArray(data.items)) {
          throw new Error(data.message || `Google News request failed with status ${response.status}.`);
        }
        if (data.items.length === 0) {
          throw new Error('Google News returned no headlines.');
        }
        setHeadlines(
          data.items.slice(0, 10).map(item => ({
            title: item.title,
            url: item.link,
            publishedAt: item.pubDate,
          })),
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load trending headlines:', error);
          setHeadlinesError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setHeadlinesLoading(false);
        }
      }
    };

    fetchTrendingNews();

    return () => controller.abort();
  }, [category, headlinesRequest]);

  useEffect(() => {
    if (category !== 'search') return;

    const twitterTrendsApiUrl = 'https://twitter-trends5.p.rapidapi.com/twitter/request.php';
    const controller = new AbortController();

    const body = new URLSearchParams({
      woeid: '23424848',
    });

    const fetchKeywords = async () => {
      try {
        const response = await fetch('/.netlify/functions/google-news?language=en', {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || data.status !== 'ok' || !Array.isArray(data.items)) {
          throw new Error(data.message || `Google News request failed with status ${response.status}.`);
        }

        setKeywords(
          data.items.slice(0, 10).map((item, index) => ({
            id: item.guid || item.link || `keyword-${index}`,
            name: (item.title || '').replace(/:\s*[\d,KkMm]+\+?\s*searches$/, '').trim(),
            link: item.link,
          })),
        );
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Failed to load Google News trends:', err);
        }
      }
    };

    const fetchTrends = async () => {
      try {
        const response = await fetch(twitterTrendsApiUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'x-rapidapi-key': 'ee8fc918e4mshaafbe7657594c9fp124bc3jsndf1496a8b3c7',
            'x-rapidapi-host': 'twitter-trends5.p.rapidapi.com',
          },
          body: body.toString(),
        });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.trends)) {
          throw new Error(data.message || `Trends service request failed with status ${response.status}.`);
        }

        setTrendsKeywords(
          data.trends.slice(0, 12).map((item, index) => ({
            id: item.guid || item.link || `trend-${index}`,
            name: item.name,
          })),
        );
      } catch (err) {
        console.error('Failed to load trending searches:', err);
      }
    };

    fetchTrends();
    fetchKeywords();
    return () => controller.abort();
  }, [category]);

  return (
    <Suspense fallback={<div className="news-page__loading">Loading news…</div>}>
      <main className="news-page">
        <header className="news-page__heading">
          <p className="news-page__eyebrow">THE LATEST FROM INDIA</p>
          <h1>{category === 'top' ? 'Top headlines' : `${capitalizeFirstLetter(category)} news`}</h1>
          <p className="news-page__intro">
            {category === 'search'
              ? 'Find the stories and topics you care about.'
              : 'The stories shaping India, selected for you.'}
          </p>
        </header>
        <div className="news-page__content">
          {category === 'search' && (
            <>
              <form
                className="news-search"
                onSubmit={event => {
                  event.preventDefault();
                  startSearch();
                }}
              >
                <input
                  type="text"
                  className="SearchNews"
                  placeholder="Search news and topics"
                  aria-label="Search news"
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  enterKeyHint="search"
                />
                <div className="SearchNewsIcon">
                  <button className="SearchNewsButton news-search__submit" type="submit">
                    Search
                  </button>
                  <button
                    className="SearchNewsButton news-search__reset"
                    type="button"
                    onClick={() => {
                      setArticles([]);
                      setPage(0);
                      setTotalResults(0);
                      setNextPage('');
                      setInput('');
                      setSearch(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>
              {articles.length === 0 && (
                <div className="newsSearches">
                  <h2 className="news-page__section-title">Explore popular topics</h2>
                  <div className="news-search__suggestions">
                  {newsSearches.map(item => (
                    <button
                      key={item}
                      className="news-search__chip"
                      onClick={() => startSearch(item)}
                    >
                      {item}
                    </button>
                  ))}
                  {trendsKeywords.map(item => (
                    <button
                      key={item.id}
                      className="news-search__chip"
                      onClick={() => {
                        if (!item.name.includes('#')) {
                          startSearch(item.name);
                        } else {
                          alert(
                            'Sorry, this trend cannot be searched due to special characters in its name. Please try another trend.',
                          );
                        }
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                  {keywords.map(item => (
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-search__chip"
                    >
                      {item.name}
                    </a>
                  ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {(category === 'top' || (category === 'search' && articles.length === 0)) && (
            <section className="containerTopHead" aria-labelledby="trending-headlines">
              <div className="news-cardTopHead">
                <div className="news-cardTopHead__heading">
                  <span className="news-cardTopHead__icon" aria-hidden="true">
                    ↗
                  </span>
                  <div>
                    <p className="news-page__eyebrow">GOOGLE NEWS INDIA · HINDI</p>
                    <h2 id="trending-headlines" className="titleTopHead">
                      Top 10 headlines
                    </h2>
                  </div>
                </div>
                {headlinesLoading ? (
                  <p className="loadingTopHead" role="status">
                    Finding the latest stories…
                  </p>
                ) : headlinesError ? (
                  <div role="alert">
                    <p className="loadingTopHead">
                      Google News headlines could not be loaded right now.
                    </p>
                    <button
                      className="SearchNewsButton"
                      type="button"
                      onClick={() => setHeadlinesRequest(request => request + 1)}
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <ul className="news-listTopHead">
                    {headlines.map((article, index) => (
                      <li key={article.url || article.title} className="news-itemTopHead">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          lang="hi"
                        >
                          {index + 1}. {article.title}
                        </a>
                        <p className="timestampTopHead">
                          {new Date(article.publishedAt).toLocaleString('en-IN')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}
        {(articles.length > 0 || loading) && (
          <div className="news-feed__heading">
            <h2>{category === 'search' ? 'Search results' : 'Latest stories'}</h2>
            {articles.length > 0 && (
              <span>{articles.length} {articles.length === 1 ? 'story' : 'stories'}</span>
            )}
          </div>
        )}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={Boolean(nextPage) && articles.length < totalResults}
          loader={loading ? <Spinner /> : null}
          endMessage={
            articles.length > 0 && (
              <p className="text-center my-4" role="status">
                You’re all caught up.
              </p>
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
              {articles.map((element, index) => (
                <div
                  className="news-feed__item"
                  key={element.article_id || element.link || `${element.title}-${index}`}
                >
                  <NewsItem
                    title={element.title || ''}
                    description={element.description || ''}
                    imageUrl={element.image_url}
                    newsUrl={element.link}
                    author={element.creator}
                    date={element.pubDate}
                    source={element.source_id}
                    content={element.content}
                  />
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </main>
    </Suspense>
  );
}

News.propTypes = {
  category: PropTypes.string,
  setProgress: PropTypes.func.isRequired,
};

export default News;
