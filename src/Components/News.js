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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const updateNews = async () => {
      let url;
      // console.log("updateNews", props);
      if (url !== undefined) {
        url = await GetRequest(
          `https://newsdata.io/api/1/news?apikey=pub_6879d4cafb3ed0fad900a2dd828177512d21&country=in&language=en,hi&page=${page}&category=${props.category}`
        );
      } else {
        url = await GetRequest(
          `https://newsdata.io/api/1/news?apikey=pub_68813d1cb70fe729b6aaab9e585c41d6d5d4&country=in&language=en,hi&page=${page}&category=${props.category}`
        );
      }
      setLoading(true);
      console.log(url);
      setArticles([...articles, ...url.results]);
      setTotalResults(url.totalResults);
      setLoading(false);
      props.setProgress(100);
    };

    updateNews();
  }, [articles, page, props, props.category, props.pageSize]);

  const fetchMoreData = () => {
    // console.log("fetchmore", page);
    const newPage = page + 1;
    // console.log(newPage);
    // let newPage = page + 1;
    setPage(newPage);

    /*     const url = GetRequest(
      `https://newsapi.org/v2/top-headlines?country=in&category=${props.category}&apiKey=9144bd5aec61439fa30794031bd04725&page=${newPage}&pageSize=${props.pageSize}`
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
      <h1 className="text-center" style={{ margin: "90px 0 35px 0" }}>
        Top {capitalizeFirstLetter(props.category)} Headlines
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
