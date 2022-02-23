import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import { GetRequest } from "./Utilities/Network/Index";
import InfiniteScroll from "react-infinite-scroll-component";

function News(props) {
  // console.log("News", props);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const updateNews = async () => {
      // console.log("updateNews", props);
      const url = await GetRequest(
        `https://newsapi.org/v2/top-headlines?country=in&category=${props.category}&apiKey=7aba1bf81d4447ef84c0468dc16c3397&page=${page}&pageSize=${props.pageSize}`
      );
      console.log(url);
      setLoading(true);
      setArticles([...articles, ...url.articles]);
      setTotalResults(url.totalResults);
      setLoading(false);
    };

    updateNews();
  }, [page, props.category, props.pageSize]);

  const fetchMoreData = () => {
    console.log("fetchmore", page);
    const newPage = page + 1;
    console.log(newPage);
    // let newPage = page + 1;
    setPage(newPage);

    /*     const url = GetRequest(
      `https://newsapi.org/v2/top-headlines?country=in&category=${props.category}&apiKey=7aba1bf81d4447ef84c0468dc16c3397&page=${newPage}&pageSize=${props.pageSize}`
    );
    setLoading(true);
    console.log(
      url.then((data) => {
        console.log(data.articles);
      })
    );
    // setArticles(articles.concat(url.articles));
    setTotalResults(url.totalResults);
    setLoading(false); */
  };

  // const handlePreviousClick = async () => {
  //   setPage(page - 1);
  //   updateNews();
  // };

  // const handleNextClick = async () => {
  //   setPage(page + 1);
  //   updateNews();
  // };

  return (
    <>
      <h1 className="text-center" style={{ margin: "35px 0px" }}>
        India Speaks - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {/* {loading && <Spinner />} */}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      key={element.url}
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
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
