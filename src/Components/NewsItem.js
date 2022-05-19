// @ts-check

import React from "react";
import "./NewsItem.css";

function NewsItem(props) {
  let { title, description, imageUrl, newsUrl, author, date, source } = props;
  // console.log("imageUrl from newsitem", title, imageUrl);
  return (
    <div className="my-3">
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position: "absolute",
            right: "0",
          }}
        >
          <span className="badge rounded-pill bg-danger">{source}</span>
        </div>
        {imageUrl !== null ? (
          <img src={imageUrl} className="card-img-top" alt="..." />
        ) : (
          <img
            src="https://media.istockphoto.com/photos/abstract-digital-news-concept-picture-id1192070239?k=20&m=1192070239&s=612x612&w=0&h=fWrzqshKbKOGLEA_UrYcbrYuhs9sWrKQ4dF8b_f_VG4="
            className="card-img-top"
            alt="..."
          />
        )}

        <div className="card-body">
          <h5 className="card-title">{title}</h5>

          <p className="card-text">{description}...</p>
          <p className="card-text">
            <small className="text-muted">
              By {!author ? "Anonymous" : author} on{" "}
              {new Date(date).toLocaleTimeString()}{" "}
              {new Date(date).toDateString()}
            </small>
          </p>
          <a
            rel="noreferrer"
            href={newsUrl}
            target="_blank"
            className="btn btn-sm btn-dark"
            style={{ float: "right" }}
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}

export default NewsItem;
