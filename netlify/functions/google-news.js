const FEED_URLS = {
  en: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
  hi: 'https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi',
};

const decodeXml = value =>
  value
    .replace(
      /<!\[CDATA\[([\s\S]*?)\]\]>|&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi,
      (entity, cdata, encoded) => {
        if (cdata !== undefined) return cdata;
        if (encoded.startsWith('#x')) return String.fromCodePoint(parseInt(encoded.slice(2), 16));
        if (encoded.startsWith('#')) return String.fromCodePoint(parseInt(encoded.slice(1), 10));

        const entities = {amp: '&', lt: '<', gt: '>', quot: '"', apos: "'"};
        return entities[encoded];
      },
    )
    .trim();

const getTagValue = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}\\s*>`, 'i'));
  return match ? decodeXml(match[1]) : '';
};

const parseGoogleNewsFeed = xml =>
  [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item\s*>/gi)].map(([, item]) => {
    const title = getTagValue(item, '(?:\\w+:)?title');
    const link = getTagValue(item, '(?:\\w+:)?link');

    return {
      title,
      link,
      guid: getTagValue(item, '(?:\\w+:)?guid') || link,
      pubDate: getTagValue(item, '(?:\\w+:)?pubDate'),
    };
  }).filter(item => item.title && item.link);

const jsonResponse = (statusCode, data, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  },
  body: JSON.stringify(data),
});

exports.handler = async event => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, {status: 'error', message: 'Method not allowed.'}, {Allow: 'GET'});
  }

  const language = event.queryStringParameters?.language || 'hi';
  const feedUrl = FEED_URLS[language];
  if (!feedUrl) {
    return jsonResponse(400, {status: 'error', message: 'Unsupported news language.'});
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {Accept: 'application/rss+xml, application/xml, text/xml'},
    });
    if (!response.ok) {
      throw new Error(`Google News returned HTTP ${response.status}.`);
    }

    const items = parseGoogleNewsFeed(await response.text()).slice(0, 20);
    if (!items.length) {
      throw new Error('Google News returned no headlines.');
    }

    return jsonResponse(
      200,
      {status: 'ok', items},
      {'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600'},
    );
  } catch (error) {
    console.error('Failed to fetch Google News RSS feed:', error);
    return jsonResponse(502, {status: 'error', message: 'Google News is temporarily unavailable.'});
  } finally {
    clearTimeout(timeout);
  }
};

exports.parseGoogleNewsFeed = parseGoogleNewsFeed;
