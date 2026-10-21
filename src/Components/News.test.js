import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import axios from 'axios';
import News from './News';
import NewsDetail from './NewsDetail';
import NewsItem from './NewsItem';
import SavedStories from './SavedStories';

jest.mock('axios');

const originalFetch = global.fetch;

beforeEach(() => {
  window.localStorage.clear();
  axios.get.mockReset();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      status: 'ok',
      items: [{guid: 'headline-1', title: 'India news', link: 'https://example.com/news', pubDate: ''}],
    }),
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

test('loads search results from a shareable query URL', async () => {
  axios.get.mockResolvedValueOnce({
    data: {status: 'ok', results: [{article_id: '1', title: 'Searchable story', link: 'https://example.com/1'}]},
  });

  render(
    <MemoryRouter initialEntries={['/search?q=india']}>
      <Routes>
        <Route path="/search" element={<News category="search" setProgress={jest.fn()} />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(await screen.findByText('Searchable story')).toBeInTheDocument();
  expect(axios.get.mock.calls[0][0]).toContain('q=india');
  expect(axios.get.mock.calls[0][0]).toContain('language=en%2Chi');
});

test('shows a recoverable state when a news request fails', async () => {
  axios.get.mockRejectedValueOnce(new Error('provider unavailable'));
  jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <MemoryRouter initialEntries={['/search?q=india']}>
      <Routes>
        <Route path="/search" element={<News category="search" setProgress={jest.fn()} />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(await screen.findByRole('alert')).toHaveTextContent('Latest stories could not be loaded');
  expect(screen.getByRole('button', {name: 'Try again'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Clear'}));
  await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
});

test('reports an empty search result set', async () => {
  axios.get.mockResolvedValueOnce({data: {status: 'ok', results: [], totalResults: 0, nextPage: ''}});

  render(
    <MemoryRouter initialEntries={['/search?q=missing']}>
      <Routes>
        <Route path="/search" element={<News category="search" setProgress={jest.fn()} />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(await screen.findByRole('heading', {name: 'No stories found'})).toBeInTheDocument();
});

test('saves and removes a story from the local reading list', async () => {
  render(
    <MemoryRouter>
      <NewsItem title="Saved story" newsUrl="https://example.com/story" />
      <SavedStories />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole('button', {name: 'Save story'}));
  expect(await screen.findAllByRole('heading', {name: 'Saved story'})).not.toHaveLength(0);
  expect(screen.getAllByRole('button', {name: 'Saved'})[0]).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(screen.getAllByRole('button', {name: 'Saved'})[0]);
  await waitFor(() => expect(screen.getByText('No saved stories yet')).toBeInTheDocument());
});

test('direct story URLs render their preview and reject unsafe destinations', () => {
  render(
    <MemoryRouter
      initialEntries={[
        '/story?title=Direct%20story&newsUrl=javascript%3Aalert(1)&description=Preview',
      ]}
    >
      <Routes>
        <Route path="/story" element={<NewsDetail />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', {name: 'This story details link is incomplete.'})).toBeInTheDocument();
  expect(screen.queryByRole('link', {name: /read original article/i})).not.toBeInTheDocument();
});

test('direct story URLs show publisher links when the destination is safe', () => {
  render(
    <MemoryRouter
      initialEntries={[
        '/story?title=Direct%20story&newsUrl=https%3A%2F%2Fexample.com%2Fstory&description=Preview',
      ]}
    >
      <Routes>
        <Route path="/story" element={<NewsDetail />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', {name: 'Direct story'})).toBeInTheDocument();
  expect(screen.getByRole('link', {name: /read original article/i})).toHaveAttribute(
    'href',
    'https://example.com/story',
  );
});
