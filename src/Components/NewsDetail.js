import React from 'react';
import {useLinkPreview} from 'get-link-preview';
import {useLocation, useNavigate} from 'react-router-dom';

function NewsDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (location.state === null) {
      navigate('/');
    }
  }, [location.state, navigate]);
  const {data} = useLinkPreview(location.state.props.newsUrl);
  return (
    <div style={{padding: '60px'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '3.25rem',
          paddingTop: '.3125rem',
          paddingBottom: '.3125rem',
        }}
      >
        India Speaks
      </div>
      <h1 style={{fontSize: '2rem'}}>{location.state.props.title}</h1>
      <div>
        <span>
          By {!location.state.props.author ? 'Anonymous' : location.state.props.author} on{' '}
          {new Date(location.state.props.date).toLocaleTimeString()}{' '}
          {new Date(location.state.props.date).toDateString()}
        </span>
      </div>
      <div style={{margin: '10px'}}>
        {location.state.props.imageUrl ? (
          <img
            src={location.state.props.imageUrl}
            style={{
              display: 'flex',
              alignContent: 'center',
              height: '350px',
              objectFit: 'contain',
              width: '100%',
            }}
            alt="..."
          />
        ) : (
          <img
            src={data ? data.image : ''}
            style={{
              display: 'flex',
              alignContent: 'center',
              height: '350px',
              objectFit: 'contain',
              width: '100%',
            }}
            alt="..."
          />
        )}
      </div>
      <p style={{fontFamily: 'system-ui'}}>{location.state.props.description}</p>
      <p style={{fontFamily: 'system-ui', lineHeight: '1.8'}}>{location.state.props.content}</p>
      <div>
        <button className="btn btn-sm btn-dark" style={{float: 'left'}} onClick={() => navigate(-1)}>
          Back
        </button>
        <a
          rel="noreferrer"
          href={location.state.props.newsUrl}
          target="_blank"
          className="btn btn-sm btn-dark"
          style={{float: 'right'}}
        >
          Go to Original Article
        </a>
      </div>
    </div>
  );
}

export default NewsDetail;
