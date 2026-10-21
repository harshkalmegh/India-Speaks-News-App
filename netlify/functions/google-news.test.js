const assert = require('node:assert/strict');
const {afterEach, test} = require('node:test');
const {handler, parseGoogleNewsFeed} = require('./google-news');

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('parses RSS titles, links, identifiers, and publication dates', () => {
  const items = parseGoogleNewsFeed(
    '<rss><channel><item><title><![CDATA[A &amp; B]]></title>' +
      '<link>https://example.com/?a=1&amp;b=2</link><guid>story-1</guid>' +
      '<pubDate>Wed, 21 Oct 2026 04:31:06 GMT</pubDate></item></channel></rss>',
  );

  assert.deepEqual(items, [
    {
      title: 'A &amp; B',
      link: 'https://example.com/?a=1&b=2',
      guid: 'story-1',
      pubDate: 'Wed, 21 Oct 2026 04:31:06 GMT',
    },
  ]);
});

test('rejects unsupported methods and languages', async () => {
  const methodResponse = await handler({httpMethod: 'POST'});
  assert.equal(methodResponse.statusCode, 405);
  assert.equal(methodResponse.headers.Allow, 'GET');

  const languageResponse = await handler({
    httpMethod: 'GET',
    queryStringParameters: {language: 'xx'},
  });
  assert.equal(languageResponse.statusCode, 400);
});

test('returns cached Hindi headlines from Google News RSS', async () => {
  let requestedUrl;
  global.fetch = async url => {
    requestedUrl = url;
    return new Response(
      '<rss><channel><item><title>शीर्ष खबर</title>' +
        '<link>https://example.com/story</link></item></channel></rss>',
      {status: 200},
    );
  };

  const response = await handler({
    httpMethod: 'GET',
    queryStringParameters: {language: 'hi'},
  });

  assert.equal(requestedUrl, 'https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi');
  assert.equal(response.statusCode, 200);
  assert.match(response.headers['Cache-Control'], /s-maxage=600/);
  assert.deepEqual(JSON.parse(response.body), {
    status: 'ok',
    items: [
      {
        title: 'शीर्ष खबर',
        link: 'https://example.com/story',
        guid: 'https://example.com/story',
        pubDate: '',
      },
    ],
  });
});

test('returns a gateway error when Google News is unavailable', async () => {
  global.fetch = async () => new Response('', {status: 503});
  const originalConsoleError = console.error;
  let loggedError;
  console.error = (...errors) => {
    loggedError = errors.at(-1);
  };

  let response;
  try {
    response = await handler({
      httpMethod: 'GET',
      queryStringParameters: {language: 'en'},
    });
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(response.statusCode, 502);
  assert.match(loggedError.message, /HTTP 503/);
  assert.deepEqual(JSON.parse(response.body), {
    status: 'error',
    message: 'Google News is temporarily unavailable.',
  });
});
