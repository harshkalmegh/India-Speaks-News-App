const assert = require('node:assert/strict');
const {afterEach, test} = require('node:test');
const {handler} = require('../../netlify/functions/news');

const originalFetch = global.fetch;
const originalKey = process.env.NEWSDATA_API_KEY;

afterEach(() => {
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.NEWSDATA_API_KEY;
  else process.env.NEWSDATA_API_KEY = originalKey;
});

test('validates methods, categories, and search length', async () => {
  assert.equal((await handler({httpMethod: 'POST'})).statusCode, 405);
  assert.equal(
    (await handler({httpMethod: 'GET', queryStringParameters: {category: 'unknown'}})).statusCode,
    400,
  );
  assert.equal(
    (
      await handler({
        httpMethod: 'GET',
        queryStringParameters: {q: 'a'.repeat(251)},
      })
    ).statusCode,
    400,
  );
  assert.equal(
    (
      await handler({
        httpMethod: 'GET',
        queryStringParameters: {language: 'xx'},
      })
    ).statusCode,
    400,
  );
});

test('returns provider stories without exposing credentials', async () => {
  process.env.NEWSDATA_API_KEY = 'server-only-key';
  let requestedUrl;
  global.fetch = async url => {
    requestedUrl = new URL(url);
    return new Response(
      JSON.stringify({
        status: 'success',
        results: [{
          article_id: 'story-1',
          title: 'Local story',
          link: 'https://example.com/story',
          image_url: 'javascript:alert(1)',
        }],
        totalResults: 1,
        nextPage: 'next-token',
      }),
      {status: 200},
    );
  };

  const response = await handler({
    httpMethod: 'GET',
    queryStringParameters: {q: 'local news'},
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['Cache-Control'], 'no-store');
  assert.equal(requestedUrl.searchParams.get('apikey'), 'server-only-key');
  assert.equal(requestedUrl.searchParams.get('q'), 'local news');
  assert.deepEqual(JSON.parse(response.body), {
    status: 'ok',
    results: [{
      article_id: 'story-1',
      title: 'Local story',
      description: '',
      link: 'https://example.com/story',
      image_url: '',
      creator: '',
      pubDate: '',
      source_id: '',
    }],
    totalResults: 1,
    nextPage: 'next-token',
  });
});

test('uses one configured key and reports unavailable credentials', async () => {
  process.env.NEWSDATA_API_KEY = 'server-only-key';
  let requestedKey;
  global.fetch = async url => {
    requestedKey = new URL(url).searchParams.get('apikey');
    return new Response(JSON.stringify({status: 'success', results: []}), {status: 200});
  };

  const success = await handler({
    httpMethod: 'GET',
    queryStringParameters: {category: 'sports'},
  });
  assert.equal(success.statusCode, 200);
  assert.equal(requestedKey, 'server-only-key');
  assert.match(success.headers['Cache-Control'], /s-maxage=600/);

  delete process.env.NEWSDATA_API_KEY;
  const originalConsoleError = console.error;
  console.error = () => {};
  let unavailable;
  try {
    unavailable = await handler({httpMethod: 'GET'});
  } finally {
    console.error = originalConsoleError;
  }
  assert.equal(unavailable.statusCode, 503);
});
