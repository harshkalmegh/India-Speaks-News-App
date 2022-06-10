import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import { GetRequest } from "./Utilities/Network/Index";
import InfiniteScroll from "react-infinite-scroll-component";

function News(props) {
  // console.log("News", props);
  const [articles, setArticles] = useState([]);
  const [, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  useEffect(() => {
    if (input === "") {
      setArticles([]);
      setSearch(false);
    }
  }, [input]);

  useEffect(() => {
    const updateNews = async () => {
      let url;
      
      if (props.category === "search") {
        if (input === "") {
          setLoading(false);
          setArticles([]);
        } else {
          
          url = await GetRequest(
            `https://newsdata.io/api/1/news?apikey=pub_6879d4cafb3ed0fad900a2dd828177512d21&country=in&language=en,hi&page=${page}&q=${input}`
          );
          if (url === undefined) {
            url = await GetRequest(
              `https://newsdata.io/api/1/news?apikey=pub_68813d1cb70fe729b6aaab9e585c41d6d5d4&country=in&language=en,hi&page=${page}&q=${input}`
            );
            if (url === undefined) {
              url = await GetRequest(
                `https://newsdata.io/api/1/news?apikey=pub_6916b9b2ca77f2af651658ac6664207d137b&country=in&language=en,hi&page=${page}&q=${input}`
              );
              if (url === undefined) {
                url = await GetRequest(
                  `https://newsdata.io/api/1/news?apikey=pub_691773564c6cc88fc0fb0fa52e1f3389a101&country=in&language=en,hi&page=${page}&q=${input}`
                );
                if (url === undefined) {
                  url = await GetRequest(
                    `https://newsdata.io/api/1/news?apikey=pub_69185e9b582562890079695628ea412ef69c&country=in&language=en,hi&page=${page}&q=${input}`
                  );
                  if (url === undefined) {
                    url = await GetRequest(
                      `https://newsdata.io/api/1/news?apikey=pub_69196c0a7d5b2498f5716de4a37b63790a42&country=in&language=en,hi&page=${page}&q=${input}`
                    );
                    if (url === undefined) {
                      url = await GetRequest(
                        `https://newsdata.io/api/1/news?apikey=pub_69206fe998104e6cd9c141719027e06873f7&country=in&language=en,hi&page=${page}&q=${input}`
                      );
                      if (url === undefined) {
                        url = await GetRequest(
                          `https://newsdata.io/api/1/news?apikey=pub_69211c566814e0d10a2f82f853254531e9e3&country=in&language=en,hi&page=${page}&q=${input}`
                        );
                        if (url === undefined) {
                          url = await GetRequest(
                            `https://newsdata.io/api/1/news?apikey=pub_69226de13f52bf066cf6b2851810bfd207b0&country=in&language=en,hi&page=${page}&q=${input}`
                          );
                          if (url === undefined) {
                            url = await GetRequest(
                              `https://newsdata.io/api/1/news?apikey=pub_69237c4e16b502b115847eae41bd56dd0262&country=in&language=en,hi&page=${page}&q=${input}`
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
          setLoading(true);
          setArticles([...articles, ...url.results]);
          setTotalResults(url.totalResults);
          setLoading(false);
        }
      } else {
      url = await GetRequest(
        `https://newsdata.io/api/1/news?apikey=pub_6879d4cafb3ed0fad900a2dd828177512d21&country=in&language=en,hi&page=${page}&category=${props.category}`
      );
      if (url === undefined) {
        url = await GetRequest(
          `https://newsdata.io/api/1/news?apikey=pub_68813d1cb70fe729b6aaab9e585c41d6d5d4&country=in&language=en,hi&page=${page}&category=${props.category}`
        );
        if (url === undefined) {
          url = await GetRequest(
            `https://newsdata.io/api/1/news?apikey=pub_6916b9b2ca77f2af651658ac6664207d137b&country=in&language=en,hi&page=${page}&category=${props.category}`
          );
          if (url === undefined) {
            url = await GetRequest(
              `https://newsdata.io/api/1/news?apikey=pub_691773564c6cc88fc0fb0fa52e1f3389a101&country=in&language=en,hi&page=${page}&category=${props.category}`
            );
            if (url === undefined) {
              url = await GetRequest(
                `https://newsdata.io/api/1/news?apikey=pub_69185e9b582562890079695628ea412ef69c&country=in&language=en,hi&page=${page}&category=${props.category}`
              );
              if (url === undefined) {
                url = await GetRequest(
                  `https://newsdata.io/api/1/news?apikey=pub_69196c0a7d5b2498f5716de4a37b63790a42&country=in&language=en,hi&page=${page}&category=${props.category}`
                );
                if (url === undefined) {
                  url = await GetRequest(
                    `https://newsdata.io/api/1/news?apikey=pub_69206fe998104e6cd9c141719027e06873f7&country=in&language=en,hi&page=${page}&category=${props.category}`
                  );
                  if (url === undefined) {
                    url = await GetRequest(
                      `https://newsdata.io/api/1/news?apikey=pub_69211c566814e0d10a2f82f853254531e9e3&country=in&language=en,hi&page=${page}&category=${props.category}`
                    );
                    if (url === undefined) {
                      url = await GetRequest(
                        `https://newsdata.io/api/1/news?apikey=pub_69226de13f52bf066cf6b2851810bfd207b0&country=in&language=en,hi&page=${page}&category=${props.category}`
                      );
                      if (url === undefined) {
                        url = await GetRequest(
                          `https://newsdata.io/api/1/news?apikey=pub_69237c4e16b502b115847eae41bd56dd0262&country=in&language=en,hi&page=${page}&category=${props.category}`
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
      setLoading(true);
      // console.log(url);
      setArticles([...articles, ...url.results]);
      setTotalResults(url.totalResults);
      setLoading(false);
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
    if (e.key === "Enter") {
      document.getElementById("myBtnSearch").click();
    }
  }

  return (
    <>
      <h1 className="text-center" style={{ margin: "90px 0 35px 0" }}>
        {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {/* {loading && <Spinner />} */}
      <div>
        {props.category === "search" ? (
          <input
            type="text"
            className="SearchNews"
            placeholder="Search Here"
            // value={input}
            onChange={(e) => {
                setInput(e.target.value);
            }}
            onKeyDown={_handleKeyDown}
          />
        ) : (
          ""
        )}
        <br />
        {props.category === "search" ? (
          <button
            className="SearchNewsButton"
         id="myBtnSearch"
            onClick={() => {
              setSearch(true);
            }}
          >
            Search
          </button>
        ) : (
          ""
        )}
      </div>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={input === "" ? "" : <Spinner />}
      >
        <div className="container">
          <div className="container">
            <div className="row">
              {articles.map((element, key) => {
                return (
                  <div className="col-md-4" key={key}>
                    <NewsItem
                      key={element.link}
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.image_url}
                      newsUrl={element.link}
                      author={element.creator}
                      date={`${element.pubDate}z`}
                      source={element.source_id}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
}

News.defaultProps = {
  country: "in",
  pageSize: 6,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
