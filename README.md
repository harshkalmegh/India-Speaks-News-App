# India Speaks

India Speaks is a React news-discovery app deployed on Netlify. It links readers to stories from their original publishers; it does not independently verify every story.

Live site: <https://indiaspeaks.netlify.app/>

## Local development

Requirements: Node.js 20 or later and npm.

1. Install dependencies with `npm ci`.
2. Create a `.env` file containing `NEWSDATA_API_KEY` with a NewsData.io API key.
3. Run the app with `npx netlify-cli dev` so local requests to `/.netlify/functions/*` reach the Netlify Functions and load local environment variables.

Do not put provider credentials in frontend variables or React source code. Netlify deploys must set `NEWSDATA_API_KEY` in the site's environment variables.

## Verification

- `npm run test:functions` runs the Netlify Function tests.
- `npm test -- --watchAll=false` runs the frontend tests.
- `npm run build` creates the production build.

The pull-request workflow runs all three checks.

## News data flow

- News search and category requests go from the browser to `netlify/functions/news.js`, which validates parameters and calls NewsData.io using server-side environment variables.
- Headline requests go to `netlify/functions/google-news.js`, which retrieves and parses the Google News RSS feed.
- Search responses are not cached by the function or service worker. Category and headline responses may be cached briefly and stale feed data is retained for offline use.
- Saved stories are stored in the browser's local storage on that device. Search phrases appear in the `/search?q=...` URL so a search can be reopened or shared.

## Credential rotation and deployment checklist

The NewsData.io and RapidAPI credentials that were previously embedded in the frontend must be revoked or rotated in their provider dashboards. Removing credentials from source does not invalidate copies already present in Git history, deployed bundles, or caches. The RapidAPI trends integration was removed; popular suggestions now come from the Google News feed. Configure the replacement NewsData.io key as `NEWSDATA_API_KEY` in Netlify before deploying.

Configure provider usage limits and function-level request protections in Netlify. The function validates inputs and applies timeouts, but serverless in-memory throttling is not a reliable substitute for platform-level rate limiting.

Before serving ads in a region, the site owner should confirm current consent-management and disclosure requirements with the advertising provider and qualified counsel. This project does not implement or certify a consent-management platform.

## Build tooling and rendering

This app remains on Create React App and client-side rendering. A build-tool migration or server/static rendering change should be treated as a separate project with deployment, routing, service-worker, and search-engine validation; this pass does not claim that browser-updated metadata is equivalent to server-rendered metadata.
