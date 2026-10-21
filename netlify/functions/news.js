require('dotenv').config({quiet: true});

const BASE_URL = 'https://newsdata.io/api/1/news';
const CATEGORIES = new Set([
  'business',
  'entertainment',
  'environment',
  'food',
  'health',
  'politics',
  'science',
  'sports',
  'technology',
  'world',
]);
const MAX_QUERY_LENGTH = 250;
const MAX_PAGE_LENGTH = 1024;

const jsonResponse = (statusCode, data, cacheControl = 'no-store') => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': cacheControl,
  },
  body: JSON.stringify(data),
});

const getApiKeys = () =>
  (process.env.NEWSDATA_API_KEY || '')
    .split(',')
    .map(key => key.trim())
    .filter(Boolean);

const isValidPage = page => page.length <= MAX_PAGE_LENGTH && !/[\u0000-\u001f]/.test(page);
const textValue = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
const safeHttpUrl = value => {
  const candidate = textValue(value, 2048);
  if (!candidate) return '';
  try {
    const url = new URL(candidate);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
};
const normalizeArticle = article => ({
  article_id: textValue(article.article_id, 200),
  title: textValue(article.title, 1000),
  description: textValue(article.description, 5000),
  link: safeHttpUrl(article.link),
  image_url: safeHttpUrl(article.image_url),
  creator: Array.isArray(article.creator)
    ? article.creator.filter(value => typeof value === 'string').slice(0, 10)
    : textValue(article.creator, 500),
  pubDate: textValue(article.pubDate, 100),
  source_id: textValue(article.source_id, 200),
});

exports.handler = async event => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, {status: 'error', message: 'Method not allowed.'}, 'no-store');
  }

  const parameters = event.queryStringParameters || {};
  const query = (parameters.q || '').trim();
  const category = parameters.category || 'top';
  const language = parameters.language || 'en,hi';
  const page = parameters.page || '';

  if (query.length > MAX_QUERY_LENGTH) {
    return jsonResponse(400, {status: 'error', message: 'Search query is too long.'});
  }
  if (query && category !== 'top') {
    return jsonResponse(400, {status: 'error', message: 'Search and category cannot be combined.'});
  }
  if (!query && category !== 'top' && !CATEGORIES.has(category)) {
    return jsonResponse(400, {status: 'error', message: 'Unsupported news category.'});
  }
  if (!['en', 'hi', 'en,hi'].includes(language)) {
    return jsonResponse(400, {status: 'error', message: 'Unsupported news language.'});
  }
  if (!isValidPage(page)) {
    return jsonResponse(400, {status: 'error', message: 'Invalid page token.'});
  }

  const apiKeys = getApiKeys();
  if (!apiKeys.length) {
    console.error('NewsData.io API credentials are not configured.');
    return jsonResponse(503, {status: 'error', message: 'News is temporarily unavailable.'});
  }

  const parametersForProvider = new URLSearchParams({
    country: 'in',
    language,
    ...(query ? {q: query} : {category}),
  });
  if (page) parametersForProvider.set('page', page);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  let lastError;

  try {
    for (const apiKey of apiKeys) {
      try {
        const url = new URL(BASE_URL);
        url.search = parametersForProvider.toString();
        url.searchParams.set('apikey', apiKey);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {Accept: 'application/json'},
        });
        const data = await response.json();
        if (!response.ok || data.status === 'error' || !Array.isArray(data.results)) {
          throw new Error(`NewsData.io returned HTTP ${response.status}.`);
        }

        const results = data.results
          .filter(article => article && typeof article === 'object' && !Array.isArray(article))
          .slice(0, 20)
          .map(normalizeArticle)
          .filter(article => article.title && article.link);
        const totalResults = Number(data.totalResults);

        return jsonResponse(
          200,
          {
            status: 'ok',
            results,
            totalResults: Number.isFinite(totalResults) ? Math.max(0, totalResults) : 0,
            nextPage: typeof data.nextPage === 'string' ? data.nextPage : '',
          },
          query
            ? 'no-store'
            : 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600',
        );
      } catch (error) {
        lastError = error;
        if (controller.signal.aborted) break;
      }
    }

    console.error('Failed to fetch NewsData.io stories:', lastError);
    return jsonResponse(502, {status: 'error', message: 'News is temporarily unavailable.'});
  } finally {
    clearTimeout(timeout);
  }
};
