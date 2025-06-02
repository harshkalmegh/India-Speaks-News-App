import React, {useState, useEffect, Suspense} from 'react';
import PropTypes from 'prop-types';
import {GetRequest} from './Utilities/Network/Index';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

const NewsItem = React.lazy(() => import('./NewsItem'));
const Spinner = React.lazy(() => import('./Spinner'));

function News(props) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState(false);
  const [nextPage, setNextPage] = useState('');
  const [headlines, setHeadlines] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const newsSearches = [
    'indore',
    'madhya pradesh',
    // 'ujjain',
    // 'dewas',
    // 'dhar',
    // 'khargone',
    // 'khandwa',
    // 'mandsaur',
    // 'ratlam',
    // 'jhabua',
    // 'alirajpur',
    // 'barwani',
    // 'burhanpur',
    'amravati',
    'maharashtra',
    // 'आरएसएस',
  ];

  useEffect(() => {
    if (input === '') {
      setArticles([]);
      setSearch(false);
    }
  }, [input]);

  useEffect(() => {
    const updateNews = async () => {
      let url;

      if (props.category === 'search') {
        if (input === '') {
          setLoading(false);
          setArticles([]);
        } else {
          url = await GetRequest(
            `https://newsdata.io/api/1/news?apikey=pub_6879d4cafb3ed0fad900a2dd828177512d21&country=in&language=en,hi&q=${input}${
              nextPage === '' ? '' : `&page=${nextPage}`
            }`,
          );
          if (url === undefined) {
            url = await GetRequest(
              `https://newsdata.io/api/1/news?apikey=pub_68813d1cb70fe729b6aaab9e585c41d6d5d4&country=in&language=en,hi&q=${input}${
                nextPage === '' ? '' : `&page=${nextPage}`
              }`,
            );
            if (url === undefined) {
              url = await GetRequest(
                `https://newsdata.io/api/1/news?apikey=pub_6916b9b2ca77f2af651658ac6664207d137b&country=in&language=en,hi&q=${input}${
                  nextPage === '' ? '' : `&page=${nextPage}`
                }`,
              );
              if (url === undefined) {
                url = await GetRequest(
                  `https://newsdata.io/api/1/news?apikey=pub_691773564c6cc88fc0fb0fa52e1f3389a101&country=in&language=en,hi&q=${input}${
                    nextPage === '' ? '' : `&page=${nextPage}`
                  }`,
                );
                if (url === undefined) {
                  url = await GetRequest(
                    `https://newsdata.io/api/1/news?apikey=pub_69185e9b582562890079695628ea412ef69c&country=in&language=en,hi&q=${input}${
                      nextPage === '' ? '' : `&page=${nextPage}`
                    }`,
                  );
                  if (url === undefined) {
                    url = await GetRequest(
                      `https://newsdata.io/api/1/news?apikey=pub_69196c0a7d5b2498f5716de4a37b63790a42&country=in&language=en,hi&q=${input}${
                        nextPage === '' ? '' : `&page=${nextPage}`
                      }`,
                    );
                    if (url === undefined) {
                      url = await GetRequest(
                        `https://newsdata.io/api/1/news?apikey=pub_69206fe998104e6cd9c141719027e06873f7&country=in&language=en,hi&q=${input}${
                          nextPage === '' ? '' : `&page=${nextPage}`
                        }`,
                      );
                      if (url === undefined) {
                        url = await GetRequest(
                          `https://newsdata.io/api/1/news?apikey=pub_69211c566814e0d10a2f82f853254531e9e3&country=in&language=en,hi&q=${input}${
                            nextPage === '' ? '' : `&page=${nextPage}`
                          }`,
                        );
                        if (url === undefined) {
                          url = await GetRequest(
                            `https://newsdata.io/api/1/news?apikey=pub_69226de13f52bf066cf6b2851810bfd207b0&country=in&language=en,hi&q=${input}${
                              nextPage === '' ? '' : `&page=${nextPage}`
                            }`,
                          );
                          if (url === undefined) {
                            url = await GetRequest(
                              `https://newsdata.io/api/1/news?apikey=pub_69237c4e16b502b115847eae41bd56dd0262&country=in&language=en,hi&q=${input}${
                                nextPage === '' ? '' : `&page=${nextPage}`
                              }`,
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          console.log('ln 85', url.nextPage);
          setLoading(true);
          setArticles([...articles, ...url.results]);
          setTotalResults(url.totalResults);
          setLoading(false);
          setNextPage(url.nextPage);
        }
      } else {
        url = await GetRequest(
          `https://newsdata.io/api/1/news?apikey=pub_6879d4cafb3ed0fad900a2dd828177512d21&country=in&language=en,hi&category=${
            props.category
          }${nextPage === '' ? '' : `&page=${nextPage}`}`,
        );
        if (url === undefined) {
          url = await GetRequest(
            `https://newsdata.io/api/1/news?apikey=pub_68813d1cb70fe729b6aaab9e585c41d6d5d4&country=in&language=en,hi&category=${
              props.category
            }${nextPage === '' ? '' : `&page=${nextPage}`}`,
          );
          if (url === undefined) {
            url = await GetRequest(
              `https://newsdata.io/api/1/news?apikey=pub_6916b9b2ca77f2af651658ac6664207d137b&country=in&language=en,hi&category=${
                props.category
              }${nextPage === '' ? '' : `&page=${nextPage}`}`,
            );
            if (url === undefined) {
              url = await GetRequest(
                `https://newsdata.io/api/1/news?apikey=pub_691773564c6cc88fc0fb0fa52e1f3389a101&country=in&language=en,hi&category=${
                  props.category
                }${nextPage === '' ? '' : `&page=${nextPage}`}`,
              );
              if (url === undefined) {
                url = await GetRequest(
                  `https://newsdata.io/api/1/news?apikey=pub_69185e9b582562890079695628ea412ef69c&country=in&language=en,hi&category=${
                    props.category
                  }${nextPage === '' ? '' : `&page=${nextPage}`}`,
                );
                if (url === undefined) {
                  url = await GetRequest(
                    `https://newsdata.io/api/1/news?apikey=pub_69196c0a7d5b2498f5716de4a37b63790a42&country=in&language=en,hi&category=${
                      props.category
                    }${nextPage === '' ? '' : `&page=${nextPage}`}`,
                  );
                  if (url === undefined) {
                    url = await GetRequest(
                      `https://newsdata.io/api/1/news?apikey=pub_69206fe998104e6cd9c141719027e06873f7&country=in&language=en,hi&category=${
                        props.category
                      }${nextPage === '' ? '' : `&page=${nextPage}`}`,
                    );
                    if (url === undefined) {
                      url = await GetRequest(
                        `https://newsdata.io/api/1/news?apikey=pub_69211c566814e0d10a2f82f853254531e9e3&country=in&language=en,hi&category=${
                          props.category
                        }${nextPage === '' ? '' : `&page=${nextPage}`}`,
                      );
                      if (url === undefined) {
                        url = await GetRequest(
                          `https://newsdata.io/api/1/news?apikey=pub_69226de13f52bf066cf6b2851810bfd207b0&country=in&language=en,hi&category=${
                            props.category
                          }${nextPage === '' ? '' : `&page=${nextPage}`}`,
                        );
                        if (url === undefined) {
                          url = await GetRequest(
                            `https://newsdata.io/api/1/news?apikey=pub_69237c4e16b502b115847eae41bd56dd0262&country=in&language=en,hi&category=${
                              props.category
                            }${nextPage === '' ? '' : `&page=${nextPage}`}`,
                          );
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        console.log('ln 140', url.nextPage);
        setLoading(true);
        setArticles([...articles, ...url.results]);
        setTotalResults(url.totalResults);
        setLoading(false);
        setNextPage(url.nextPage);
        props.setProgress(100);
      }
    };

    updateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, props.category, props.pageSize, search]);

  const fetchMoreData = () => {
    const newPage = page + 1;
    setPage(newPage);
  };

  function _handleKeyDown(e) {
    if (e.key === 'Enter') {
      document.getElementById('myBtnSearch').click();
    }
  }

  const fetchTrendingNews = async () => {
    const API_KEY = 'a366374da3f46fbd0ba3093b4430d982'; // 🔁 Replace with your real key
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&country=in&token=${API_KEY}`;

    try {
      const response = await axios.get(url);
      setHeadlines(response.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingNews();
  }, []);

  const getGoogleTranslateLink = text => {
    const encoded = encodeURIComponent(text);
    return `https://translate.google.com/?sl=en&tl=hi&text=${encoded}&op=translate`;
  };

  useEffect(() => {
    // RSS feed for Google Trends Daily - India
    const googleTrendsRssUrl = 'https://trends.google.com/trending/rss?geo=IN&hours=48&sort=relevance';
    // Using rss2json API to convert RSS to JSON and bypass CORS
    const rssToJsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      googleTrendsRssUrl,
    )}`;

    const fetchKeywords = async () => {
      setLoading(true);
      try {
        const response = await fetch(rssToJsonApiUrl);

        // Try to parse the response as JSON. rss2json usually sends JSON even for its own errors.
        let data;
        try {
          data = await response.json();
          console.log('Fetched data from rss2json:', data);
        } catch (jsonError) {
          // This catch block handles cases where the response body isn't valid JSON.
          // This might happen for network errors before reaching rss2json, or if rss2json itself returns non-JSON.
          console.error('Failed to parse JSON response from RSS service:', jsonError);
          throw new Error(
            `Failed to parse response from RSS service. HTTP status: ${response.status} ${response.statusText}. The service might be down or returning an unexpected format.`,
          );
        }

        if (!response.ok) {
          // HTTP error (e.g., 4xx, 5xx from rss2json server itself, not from Google Trends source)
          // 'data' (parsed JSON above) might contain an error message from rss2json (e.g., {status: 'error', message: '...'})
          throw new Error(data.message || `RSS service connection error. HTTP status: ${response.status}.`);
        }

        // At this point, response.ok was true (HTTP 200).
        // Now check the 'status' field within the JSON payload from rss2json.
        if (data.status === 'ok' && data.items) {
          // Successfully fetched and parsed data from rss2json
          const fetchedKeywords = data.items.slice(0, 10).map((item, index) => {
            let searches = 'N/A';
            if (item.description) {
              // Example: <ht:approx_traffic>50,000+</ht:approx_traffic>
              const trafficMatch = item.description.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/);
              if (trafficMatch && trafficMatch[1]) {
                searches = trafficMatch[1].replace(/,/g, '') + ' searches'; // Remove commas for consistency
              }
            }
            // Fallback if not in description, check title (less common for daily trends RSS)
            if (searches === 'N/A' && item.title) {
              const titleTrafficMatch = item.title.match(/:\s*([\d,KkMm]+\+)\s*searches/);
              if (titleTrafficMatch && titleTrafficMatch[1]) {
                searches = titleTrafficMatch[1];
              }
            }

            return {
              id: item.guid || item.link || `keyword-${index}`, // Ensure a unique key, fallback to link or index
              name: item.title.replace(/:\s*[\d,KkMm]+\+?\s*searches$/, '').trim(), // Clean up title if it has search count
              searches: searches,
              link: item.link,
              pubDate: item.pubDate,
            };
          });
          setKeywords(fetchedKeywords);
        } else {
          // rss2json returned HTTP 200 OK, but its internal processing failed (e.g., couldn't fetch the source RSS)
          // data.message should contain the specific error like "Cannot download this RSS feed..."
          throw new Error(data.message || 'RSS conversion service reported an issue processing the feed.');
        }
      } catch (err) {
        // This will catch errors from fetch (network), response.json(), or errors thrown explicitly above.
        console.error('Detailed error in fetchKeywords:', err); // Log the full error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchKeywords();
    // Optional: set up a timer to refresh data periodically
    // const intervalId = setInterval(fetchKeywords, 30 * 60 * 1000); // Refresh every 30 minutes
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <h1 className="text-center" style={{margin: '90px 0 35px 0'}}>
          {capitalizeFirstLetter(props.category)} Headlines
        </h1>
        {/* {loading && <Spinner />} */}
        <div>
          {props.category === 'search' ? (
            <>
              <input
                type="text"
                className="SearchNews"
                placeholder="Search Here"
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                }}
                onKeyDown={_handleKeyDown}
              />
              <div className="SearchNewsIcon">
                <button
                  className="SearchNewsButton"
                  id="myBtnSearch"
                  onClick={() => {
                    setSearch(true);
                  }}
                >
                  Search
                </button>
                <button
                  className="SearchNewsButton"
                  id="myBtnSearch"
                  onClick={() => {
                    setArticles([]);
                    setLoading(false);
                    setInput('');
                    window.location.reload();
                  }}
                >
                  Reset
                </button>
              </div>
              {articles.length === 0 && (
                <div className="newsSearches" style={{textAlign: 'center'}}>
                  {newsSearches.map((item, index) => (
                    <button
                      key={index}
                      className="btn btn-outline-primary btn-sm m-1"
                      onClick={() => {
                        setInput(item); // Set the clicked item as the input
                        setSearch(true); // Trigger the search
                      }}
                    >
                      {item}
                    </button>
                  ))}
                  <br />
                  {keywords.map((item, index) => (
                    <button
                      key={index}
                      className="btn btn-outline-primary btn-sm m-1"
                      onClick={() => {
                        setInput(item.name); // Set the clicked item as the input
                        setSearch(true); // Trigger the search
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
              {articles.length === 0 && headlines.length !== 0 && (
                <div className="containerTopHead">
                  <div className="news-cardTopHead">
                    <h1 className="titleTopHead">🇮🇳 Top 10 Trending News Headlines in India</h1>
                    {loading ? (
                      <p className="loadingTopHead">Loading...</p>
                    ) : (
                      <ul className="news-listTopHead">
                        {headlines.map((article, index) => (
                          <li key={index} className="news-itemTopHead">
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              {index + 1}. {article.title}
                            </a>
                            <br />
                            <a
                              href={getGoogleTranslateLink(article.title)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="translate-link"
                            >
                              🔄 Translate to Hindi
                            </a>
                            <p className="timestampTopHead">
                              {new Date(article.publishedAt).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            ''
          )}
        </div>
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={input.length === 0 ? '' : <Spinner />}
        >
          <div className="container">
            <div className="container">
              <div className="row">
                {articles.map((element, key) => {
                  return (
                    <div className="col-md-4" key={key}>
                      <NewsItem
                        key={element.link}
                        title={element.title ? element.title : ''}
                        description={element.description ? element.description : ''}
                        imageUrl={element.image_url}
                        newsUrl={element.link}
                        author={element.creator}
                        date={`${element.pubDate}z`}
                        source={element.source_id}
                        content={element.content}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </InfiniteScroll>
      </Suspense>
    </>
  );
}

News.defaultProps = {
  country: 'in',
  pageSize: 6,
  category: 'general',
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
