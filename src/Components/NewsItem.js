// @ts-check

import React from 'react';
import {useLinkPreview} from 'get-link-preview';

function NewsItem(props) {
  let {title, description, imageUrl, newsUrl, author, date, source} = props;

  const {data} = useLinkPreview(newsUrl);
  return (
    <div className="my-3">
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
            right: '0',
          }}
        >
          <span className="badge rounded-pill bg-danger">{source}</span>
        </div>
        {imageUrl ? (
          <img src={imageUrl} className="card-img-top" alt="..." />
        ) : (
          // @ts-ignore
          <img src={data ? data.image : ''} className="card-img-top" alt="..." />
        )}
        <div className="card-body">
          <h1 className="card-title">{title}</h1>
          <p className="card-text">{description}...</p>
          <p className="card-text">
            <small className="text-muted">
              By {!author ? 'Anonymous' : author} on {new Date(date).toLocaleTimeString()}{' '}
              {new Date(date).toDateString()}
            </small>
          </p>
          <a
            rel="noreferrer"
            href={newsUrl}
            target="_blank"
            className="btn btn-sm btn-dark"
            style={{float: 'right'}}
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}

export default NewsItem;
